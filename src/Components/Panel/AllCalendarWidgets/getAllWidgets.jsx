import React, { useContext } from 'react';
import { globalDataContext } from '../../../globalContext';

const CreateWidgets = (
    smallWidgets = false
) => {
    const [ dataContext, ] = useContext(globalDataContext);

    const getCountDaysString = difference => {
        switch (difference) { 
            case 0: return "Today";
            case 1: return "Tomorrow";
            case 7: return "In 1 Week";
            case 14: return "In 2 Weeks";
            case 21: return "In 3 Weeks";
            default: return `In ${difference} days`;
        }
    }

    const calculateDifference = (start, end) => {
        return Math.floor((Date.parse(start) - Date.parse(end)) / 86400000) + 1;
    }

    const CreateWidget = (
        widgetType = "",
        ID = 0,
        date = "",
        type = "",
        description = ""
    ) => {
        const curDate = new Date();
        const evDate = new Date(date);
        const difference = calculateDifference(evDate, curDate);

        if (isNaN(difference)) return (<></>);
        
        return (
            <div className={`widget ${smallWidgets ? "small" : ""} ${widgetType}`} key={`${type}:${ID}:${Math.random()}`}>
                <div className="widget-header">
                    <p className="count-days">{getCountDaysString(difference)}</p>
                    <p className="orig-date">({date})</p>
                </div>
                <p className="type">{type}</p>
                <p className="description">{description}</p>
            </div>
        )
    }

    const curDate = new Date();
    const calendar = dataContext.librusData.calendar;
    let elementsData = [];
    let returnData = [];

    for (const data of calendar.absences) {
        elementsData.push({
            date: data.date,
            widget: CreateWidget("absence", data.msgID, data.date, `Absence: ${data.teacher}`)
        });
    }

    for (const data of calendar.appealAndShifts) {
        elementsData.push({
            date: data.date,
            widget: CreateWidget("appealshifts", data.msgID, data.date, data.title)
        });
    }

    for (const data of calendar.tests) {
        elementsData.push({
            date: data.date,
            widget: CreateWidget("test", data.msgID, data.date, `${data.lesson} - ${data.type}`, data.description)
        });
    }

    elementsData.sort((obj1, obj2) => {
        const obj1Date = new Date(obj1.date);
        const obj2Date = new Date(obj2.date);

        if (obj1Date.getTime() < obj2Date.getTime()) return -1;
        if (obj1Date.getTime() > obj2Date.getTime()) return 1;

        return 0;
    })
    
    for (const element of elementsData) {
        const difference = calculateDifference(new Date(element.date), curDate);
        if (difference < 0) continue;
        if (curDate.getHours() > 20 && difference === 0) continue; 

        returnData.push(element.widget);
    }
    
    return returnData;
}

export { CreateWidgets };