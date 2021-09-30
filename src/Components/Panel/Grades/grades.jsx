import React, { useContext, useEffect, useState } from 'react';
import { globalDataContext } from '../../../globalContext';

import { MainPanel, NavigatePanel } from '../mainPanel';
import PanelShortcuts from '../panelShortcuts';

import Arrow from '../../../Images/img/Arrow.png';

import '../panel.scss';
import './grades.scss';

const Grades = () => {
    const [ dataContext, ] = useContext(globalDataContext);
    const [ currentSemester, setCurrentSemester ] = useState("first");

    useEffect(() => {
        // Update To Second Semester Automatically if it exists
        let grades = dataContext.librusData.grades;

        for (const grade of grades) {
            if (grade.semester2.normal.length > 0) {
                setCurrentSemester("second");
            }
        }
    }, [dataContext]);

    const setGradeBackground = weightString => { // Set Grade Background depending on grade's weight
        const weight = parseInt(weightString);

        switch (weight) {
            case 8: case 9: case 10:
                return "#eb4d4b";

            case 5: case 6: case 7:
                return "#f0932b";

            default: return "#686de0";
        } 
    }

    const switchDescriptionMenu = target => {
        const currentElement = target.localName === "p" ? target.parentElement : target; // Detect if we press on the grade box or grade text (Just fixed bug)
        currentElement.classList.toggle("active");

        // Reset all actives widgets
        const selector = document.querySelectorAll(".grade-widget.active");
        if (selector.length > 0) {
            for (const select of selector) {
                if (select === currentElement) continue;

                select.classList.remove("active");
            }
        }
    }

    const drawGradesWidgets = (grades) => {
        let returnData = [];

        for (const grade of grades) {
            if (grade === undefined) continue;
            returnData.push(
                <div className="grade-widget" style={{
                    backgroundColor: setGradeBackground(grade.multiplier)
                }} onClick={click => switchDescriptionMenu(click.target)} key={`${grade.grade}:${grade.lesson}:${Math.random()}`}>
                    <p>{grade.grade}</p>
                    <div className="grade-widget-desc">
                        <div className="grade-widget-desc-header">
                            <h3>{grade.lesson}</h3>
                            <span>{grade.category}</span>
                        </div>
                        <div className="grade-widget-desc-row">
                            <span>Comment: </span>
                            <span>{grade.comment === "" ? "-" : grade.comment}</span>
                        </div>
                        <div className="grade-widget-desc-row">
                            <span>Grade: </span>
                            <span>{grade.grade}</span>
                        </div>
                        <div className="grade-widget-desc-row">
                            <span>Multiplier: </span>
                            <span>{grade.multiplier}</span>
                        </div>
                        <div className="grade-widget-desc-row">
                            <span>In Average: </span>
                            <span>{grade.inAverage === true ? "Yes" : "No"}</span>
                        </div>
                        <div className="grade-widget-desc-row">
                            <span>Teacher: </span>
                            <span>{grade.teacher}</span>
                        </div>
                        <div className="grade-widget-desc-row">
                            <span>Date: </span>
                            <span>{grade.date}</span>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="grade-widgets">
                {returnData}
            </div>
        )
    }

    const calculateAverageGrade = grades => {
        let gradesSum = 0;
        let gradesSize = 0;

        for (const grade of grades) {
            if (!grade.inAverage || grade.grade === "+" || grade.grade === "-" || grade.grade === "np" || grade.grade === "nb" || grade.grade === "0") continue;
            let currentGrade = parseInt(grade.grade);
            let currentMultiplier = parseInt(grade.multiplier);

            if (grade.grade.indexOf('-') !== -1) {
                currentGrade -= 0.25;
            }
            if (grade.grade.indexOf('+') !== -1) {
                currentGrade += 0.5;
            }

            gradesSum += currentGrade * currentMultiplier;
            gradesSize += currentMultiplier;
        }

        const result = (gradesSum / gradesSize).toFixed(2);

        return isNaN(result) ? "-" : result;
    }

    const drawGradesRows = () => {
        let grades = dataContext.librusData.grades;
        let returnData = [];

        for (const grade of grades) {
            const gradesList = currentSemester === "second" ? grade.semester2 : grade.semester1;

            returnData.push(
                <tr key={`${grade.subject}`}>
                    <td>{grade.subject}</td>
                    <td>{drawGradesWidgets(gradesList.normal)}</td>
                    <td style={{textAlign: 'center'}}>{calculateAverageGrade(gradesList.normal)}</td>
                    <td style={{textAlign: 'center', fontWeight: '500'}}>{gradesList.final === "" ? "-" : gradesList.final}</td>
                </tr>
            )
        }

        return returnData;
    }

    const DrawGradesTable = () => {        
        return (
            <table className="grades-table">
                <thead>
                    <tr>
                        <th width="25%">Lesson</th>
                        <th width="60%">Grades</th>
                        <th width="8%">Average</th>
                        <th width="5%">Final</th>
                    </tr>
                </thead>
                <tbody>
                    {drawGradesRows()}
                </tbody>
            </table>
        )
    }

    const DrawChangeSemesterSection = () => {
        return (
            <div className="change-semester">
                <img className={currentSemester === 'first' ? 'disabled' : ''} src={Arrow} alt="LeftArrow" title="Set Previous Semester" onClick={() => {
                    setCurrentSemester('first')
                }}/>
                <p>{currentSemester === 'first' ? "First Semester" : "Second Semester"}</p>
                <img className={currentSemester === 'second' ? 'disabled' : ''} src={Arrow} alt="RightArrow" title="Set Next Semester" onClick={() => {
                    setCurrentSemester('second');
                }}/>
            </div>
        );
    }

    const componentToDraw = (
        <div>
            <div className="panel-section">
                <p className="panel-header">Grades</p>
                <NavigatePanel />
                <DrawChangeSemesterSection />
                <div className="grades">
                    <DrawGradesTable />
                </div>
            </div>
            <div className="panel-section">
                <p className="panel-header">Shortcuts</p>
                <PanelShortcuts currentPanel="Grades" />
            </div>
        </div>
    );

    return (
        <MainPanel componentInside={componentToDraw} />
    )
}

export default Grades;