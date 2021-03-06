import React, { useContext, useState, useEffect, useCallback } from 'react';
import { GlobalDataContext, ShortcutsPanelContext } from '../../../globalContext';

import { MainPanel, NavigatePanel } from '../mainPanel';

import Arrow from '../../../Images/img/Arrow.png';

import './schedule.scss';
import '../panel.scss';

const Schedule = () => {
    const [ currentWeek, setCurrentWeek ] = useState("current");

    const [ dataContext, ] = useContext(GlobalDataContext);
    const [ currentPanel, setCurrentPanel ] = useContext(ShortcutsPanelContext);

    const CheckPanel = useCallback((panel) => {
        if (currentPanel !== panel) {
            setCurrentPanel(panel);
        }
    }, [currentPanel, setCurrentPanel]);

    useEffect(() => {
        CheckPanel('Schedule');

        const curDate = new Date();

        if (curDate.getDay() === 0 || (curDate.getDay() > 5)) {
            setCurrentWeek('next');
        }
    }, [CheckPanel]);

    const RenderScheduleTable = ({
        week = ""
    }) => {
        let schedule = dataContext.librusData.schedule;
        const lessons = week === 'current' ? schedule.currentWeek : week === 'prev' ? schedule.previousWeek : schedule.nextWeek;
        const todayDate = new Date();
        let today = todayDate.getDay();

        if (todayDate.getHours() > 19) today++;

        const generateDayObject = (dayObject) => {
            if (dayObject !== undefined) {
                return {
                    title: dayObject === null ? "" : dayObject.title,
                    flag: dayObject === null ? "" : dayObject.flag,
                    insideFields: dayObject === null ? { firstField: null, secondField: null } : dayObject.insideFields
                }
            }

            return {
                title: "",
                flag: ""
            }
        }

        const getTableDate = (day, index) => {
            switch (day) {
                case 'Monday': return generateDayObject(lessons.table.Monday[index]);
                case 'Tuesday': return generateDayObject(lessons.table.Tuesday[index]);
                case 'Wednesday': return generateDayObject(lessons.table.Wednesday[index]);
                case 'Thursday': return generateDayObject(lessons.table.Thursday[index]);
                case 'Friday': return generateDayObject(lessons.table.Friday[index]);

                default: return generateDayObject(lessons.table.Monday);
            }
        }

        const drawTable = () => {
            let array = [];
            // todo selected but date

            const IsItToday = (dateToCheck) => {
                const today = new Date();
                const check = new Date(dateToCheck);

                if (today.getDate() === check.getDate() &&
                    today.getMonth() === check.getMonth() &&
                    today.getFullYear() === check.getFullYear()) 
                {
                    return true;
                }

                return false;
            }

            const CreateTdElement = ({
                dayObject = null,
                date = ""
            }) => {
                let returnData = null;

                const hasTwoFields = dayObject.insideFields === undefined ? false : dayObject.insideFields.secondField !== null;

                if (hasTwoFields) {
                    returnData = (
                        <>
                            <div>
                                <span>{dayObject.insideFields.firstField.flag}</span>
                            </div>
                            <p><strike>{dayObject.insideFields.firstField.title}</strike></p>
                            <div className="second-flag">
                                <span>{dayObject.insideFields.secondField.flag}</span>
                            </div>
                            <p className="second-flag">{dayObject.insideFields.secondField.title}</p>
                        </>
                    )
                }
                else {
                    if (dayObject.flag === 'odwo??ane' || dayObject.flag === "przesuni??cie") {
                        returnData = (
                            <>
                                <div>
                                    <span>{dayObject.flag}</span>
                                </div>
                                <p>{dayObject.flag !== "" ? <strike>{dayObject.title}</strike> : dayObject.title}</p>
                            </>
                        )
                    }
                    else {
                        returnData = (
                            <>
                                <div>
                                    <span>{dayObject.flag}</span>
                                </div>
                                <p>{dayObject.title}</p>
                            </>
                        )
                    }
                }
                
                return (
                    <td className={`${IsItToday(date) ? "selected" : "" } ${dayObject.flag !== "" ? "flag" : ""}`}>
                        {returnData}
                    </td>
                )
            }

            let increaseIndexValue = 0;
            for (let i = 0; i < lessons.hours.length; i++) {
                // Detect Lesson 0 at 7 am
                if (i === 0) {
                    const foundLessonZero = lessons.hours[i].indexOf('07') !== -1;

                    if (!foundLessonZero) increaseIndexValue = 1;
                }
                const mondayObject = getTableDate("Monday", i);
                const tuesdayObject = getTableDate("Tuesday", i);
                const wednesdayObject = getTableDate("Wednesday", i);
                const thursdayObject = getTableDate("Thursday", i);
                const fridayObject = getTableDate("Friday", i);

                array.push((
                    <tr style={{verticalAlign: 'top'}} key={`${mondayObject.title}:${mondayObject.flag}:${Math.random()}`}>
                        <td className="middle-align">{i + increaseIndexValue}</td>
                        <td className="middle-align">{lessons.hours[i]}</td>
                        <CreateTdElement date={lessons.currentWeekDays[0]} dayObject={mondayObject} />
                        <CreateTdElement date={lessons.currentWeekDays[1]} dayObject={tuesdayObject} />
                        <CreateTdElement date={lessons.currentWeekDays[2]} dayObject={wednesdayObject} />
                        <CreateTdElement date={lessons.currentWeekDays[3]} dayObject={thursdayObject} />
                        <CreateTdElement date={lessons.currentWeekDays[4]} dayObject={fridayObject} />
                    </tr>
                ));
            }

            return array;
        }

        const tableData = drawTable().map(data => { return data });

        const TitleCell = ({ day, dateString }) => {
            return (
                <th height="40" className={today === 1 ? "table-title selected" : "table-title"}>
                    <p>{day}</p>
                    <p className='date'>{dateString}</p>
                </th>
            )
        }

        return (
            <table>
                <thead>
                    <tr className="middle-align">
                        <th width="3%"></th>
                        <th width="10%">Hour</th>
                        <TitleCell day="Monday"     dateString={lessons.currentWeekDays[0]} />
                        <TitleCell day="Tuesday"    dateString={lessons.currentWeekDays[1]} />
                        <TitleCell day="Wednesday"  dateString={lessons.currentWeekDays[2]} />
                        <TitleCell day="Thursday"   dateString={lessons.currentWeekDays[3]} />
                        <TitleCell day="Friday"     dateString={lessons.currentWeekDays[4]} />
                    </tr>
                </thead>
                <tbody>
                    {tableData}
                </tbody>
            </table>
        );
    }

    const DrawChangeDateSection = ({
        week = ""
    }) => {
        let schedule = dataContext.librusData.schedule;
        const curWeek = week === 'current' ? schedule.currentWeek.currentWeekString : week === 'prev' ? schedule.previousWeek.currentWeekString : schedule.nextWeek.currentWeekString;

        return (
            <div className="change-date">
                <img className={currentWeek === 'prev' ? 'disabled' : ''} src={Arrow} alt="LeftArrow" title="Set Previous Week" onClick={() => {
                    if (week === 'prev') setCurrentWeek('prev');
                    else if (week === 'current') setCurrentWeek('prev');
                    else if (week === 'next') setCurrentWeek('current');
                }}/>
                <p>{curWeek}</p>
                <img className={currentWeek === 'next' ? 'disabled' : ''} src={Arrow} alt="RightArrow" title="Set Next Week" onClick={() => {
                    if (week === 'prev') setCurrentWeek('current');
                    else if (week === 'current') setCurrentWeek('next');
                    else if (week === 'next') setCurrentWeek('next');
                }}/>
            </div>
        );
    }

    const componentToDraw = (
        <div>
            <div className="panel-section panel-padding panel-padding">
                <p className="panel-header">Schedule</p>
                <NavigatePanel />
                <DrawChangeDateSection week={currentWeek}/>
                <div className="schedule">
                    <RenderScheduleTable week={currentWeek}/>
                </div>
            </div>
        </div>
    )

    return (
        <MainPanel componentInside={componentToDraw} />
    )
}

export default Schedule;