import React, { useContext, useEffect, useCallback } from 'react';
import { GlobalDataContext, ShortcutsPanelContext } from '../../../globalContext';
import { MainPanel, NavigatePanel } from '../mainPanel';

import '../panel.scss';
import './absences.scss';

import Loading from '../../../Images/img/Loading.png';

const ipcRenderer = window.require("electron").ipcRenderer;

const Absences = () => {
    const [ dataContext, ] = useContext(GlobalDataContext);
    const [ currentPanel, setCurrentPanel ] = useContext(ShortcutsPanelContext);

    const CheckPanel = useCallback((panel) => {
        if (currentPanel !== panel) {
            setCurrentPanel(panel);
        }
    }, [currentPanel, setCurrentPanel]);

    useEffect(() => {
        CheckPanel('Absences');
    }, [CheckPanel]);

    const GetColorFromAbsence = (value, border, description) => {
        const opacity = description ? 'b7' : ''; // as hex

        switch (value) {
            case 'nk': case 'Nk': case 'nb': return `#eb3b5a${opacity}`;
            case 'u': return `#44bd32${opacity}`;
            case 'sp': return `#8e44ad${opacity}`;
            case 'zw': return `#e15f41${opacity}`;

            default: return border ? `#393e49${opacity}` : 'transparent';
        }
    }

    const DrawAbsenceRow = ({
        index,
        date, 
        absences,
        values
    }) => {
        let alreadySelected = false;

        const DrawAbsences = absences.map((obj, i) => {
            const value = obj === null ? '-' : obj.type;
            const absenceID = obj === null ? 0 : obj.id;
            const tdID = `absence-${index}-${i}`;
            
            const OnHover = e => {
                if (!alreadySelected && currentPanel === 'Absences') {
                    const td = e.target.localName === 'span' ? e.target.parentElement : e.target;
                    if (td !== null) {
                        const isNotNull = td.firstChild === null ? false : td.firstChild.innerHTML !== '-';

                        if (isNotNull) {
                            td.classList.toggle('active');

                            ipcRenderer.invoke("fetch-absence-data", absenceID).then(data => {
                                if (data !== 'fail') {
                                    const spinnerSelector = document.querySelector(`.loading-spinner.${tdID}`);
                                    const descriptionData = document.querySelector(`.absence-data.${tdID}`);

                                    // Header
                                    descriptionData.childNodes[0].firstChild.innerHTML = data.subject;
                                    descriptionData.childNodes[0].lastChild.innerHTML = data.type;

                                    // Subject
                                    descriptionData.childNodes[1].lastChild.innerHTML = data.subject;

                                    // Lesson
                                    descriptionData.childNodes[2].lastChild.innerHTML = data.lessonHour;

                                    // Teacher
                                    descriptionData.childNodes[3].lastChild.innerHTML = data.teacher;

                                    // Trip
                                    descriptionData.childNodes[4].lastChild.innerHTML = data.trip ? 'Yes' : 'No';

                                    spinnerSelector.classList.add('hide-spinner');
                                    descriptionData.classList.add('active-absence-data');
                                }                              
                            });

                            alreadySelected = true;
                        }
                    }
                }
            }

            const OnLeft = () => {
                alreadySelected = false;

                // Reset 
                const selector = document.querySelectorAll(".absence-td.active");
                if (selector.length > 0) {
                    for (const select of selector) {    
                        select.classList.remove("active");
                    }
                }
            }

            return (
                <td className='absence-td' width={20} style={{
                    border: '0.1px solid #393e49',
                    textAlign: 'center',
                    background: GetColorFromAbsence(value),
                    borderColor: GetColorFromAbsence(value, true)
                }} onMouseOver={OnHover} onMouseLeave={OnLeft}>
                    <span>{value}</span>
                    <div className='absence-td-desc' style={{
                        background: GetColorFromAbsence(value, false, true)
                    }}>
                        <div className={`loading-spinner ${tdID}`}>
                            <img src={Loading} alt='spinner' />
                        </div>
                        <div className={`absence-data ${tdID}`}>
                            <div className="absence-row-header">
                                <h3>null</h3>
                                <span>-</span>
                            </div>
                            <div className='absence-row'>
                                <span>Subject</span>
                                <span>-</span>
                            </div>
                            <div className='absence-row'>
                                <span>Lesson</span>
                                <span>0</span>
                            </div>
                            <div className='absence-row'>
                                <span>Teacher</span>
                                <span>-</span>
                            </div>
                            <div className='absence-row'>
                                <span>Trip</span>
                                <span>No</span>
                            </div>
                        </div>
                    </div>
                </td>
            );
        });

        const TableStyleTh = {
            border: '0.1px solid #393e49',
            color: '#919191'
        };

        const TableStyleTd = {
            border: '0.1px solid #393e49',
            fontWeight: '300',
        };

        return (
            <tr>
                <td style={{textAlign: 'center'}}>{date}</td>
                <td>
                    {DrawAbsences}
                </td>
                <td>
                    <table style={{
                        position: 'relative',
                        width: '100%',
                        borderCollapse: 'collapse',
                        textAlign: 'center'
                    }}>
                        <thead>
                            <th title='Absences' style={TableStyleTh}>A</th> 
                            <th title='Unexcused Absences' style={TableStyleTh}>UA</th>
                            <th title='Justified Absences' style={TableStyleTh}>JA</th>
                            <th title='Lateness' style={TableStyleTh}>L</th>
                            <th title='Exemptions' style={TableStyleTh}>Ex</th>
                        </thead>
                        <tbody>
                            <td style={TableStyleTd}>{values[2]}</td>
                            <td style={TableStyleTd}>{values[1]}</td>
                            <td style={TableStyleTd}>{values[0]}</td>
                            <td style={TableStyleTd}>{values[3]}</td>
                            <td style={TableStyleTd}>{values[4]}</td>
                        </tbody>
                    </table>
                </td>
            </tr>
        );
    }

    const DrawAbsencesRows = () => {
        const absences = dataContext.librusData.absences;

        const dataToDraw = absences.map((obj, i) => {
            return <DrawAbsenceRow index={i} date={obj.date} absences={obj.table} values={obj.info} key={i} />
        });

        return dataToDraw;
    }

    const DrawTable = () => {
        return (
            <table className="under-line">
                <thead>
                    <tr>
                        <th width="15%">Date</th>
                        <th width="45%">Lessons</th>
                        <th>Values</th>
                    </tr>
                </thead>
                <tbody>
                    <DrawAbsencesRows />
                </tbody>
            </table>
        )
    } 

    const componentToDraw = (
        <div>
            <div className="panel-section panel-padding">
                <p className="panel-header">Absences</p>     
                <NavigatePanel />   
                <div className="absences">
                    <DrawTable />
                </div>
            </div>
        </div>
    );

    return (<MainPanel componentInside={componentToDraw} />)
}

export default Absences;