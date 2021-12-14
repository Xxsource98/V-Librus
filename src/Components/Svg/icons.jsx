import React from "react";

import './icons.scss';

const HomeIcon = ({
    color = '',
    width = 64,
    height = 64
}) => {
    return (       
        <svg width={width} height={height} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84.07 96.97">
            <polygon style={{stroke: color}} className="home-cls-1" points="81.57 41.51 81.57 94.47 42.03 94.47 2.5 94.47 2.5 41.51 42.78 3.47 81.57 41.51"/>
        </svg>
    );
}


const GradesIcon = ({
    color = '',
    width = 64,
    height = 64
}) => {
    return (    
        <svg width={width} height={height} id="Layer_1" data-name="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 83.5 114">
            <path className="grades-cls-1" style={{fill: color}} d="M100,12V116H27V12h73m0-5H27a5,5,0,0,0-5,5V116a5,5,0,0,0,5,5h73a5,5,0,0,0,5-5V12a5,5,0,0,0-5-5Z" transform="translate(-22 -7)"/><text style={{fill: color}} className="grades-cls-2" transform="translate(38.64 60.96)">+</text><text style={{fill: color}} className="grades-cls-2" transform="translate(18.47 72.84)">A</text>
        </svg>
    );
}


const ScheduleIcon = ({
    color = '',
    width = 64,
    height = 64
}) => {
    return (
        <svg width={width} height={height} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124.4 103.5">
            <path style={{fill: color}} className="schedule-cls-1" d="M120.69,32.12a.71.71,0,0,1,.71.71v76.46a.71.71,0,0,1-.71.71H7.71a.71.71,0,0,1-.71-.71V32.83a.71.71,0,0,1,.71-.71h113m0-5H7.71A5.71,5.71,0,0,0,2,32.83v76.46A5.7,5.7,0,0,0,7.71,115h113a5.71,5.71,0,0,0,5.71-5.71V32.83a5.71,5.71,0,0,0-5.71-5.71Z" transform="translate(-2 -11.5)"/><line style={{stroke: color}} className="schedule-cls-2" x1="2.28" y1="39.02" x2="122.11" y2="39.02"/><line style={{stroke: color}} className="schedule-cls-1" x1="2.28" y1="39.02" x2="122.11" y2="39.02"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="13.12" y="44.73" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="26.19" y="44.63" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="39.06" y="44.68" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="52.13" y="44.58" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="64.89" y="44.7" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="77.96" y="44.61" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="90.83" y="44.65" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="103.9" y="44.56" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="12.76" y="57.27" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="25.83" y="57.17" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="38.7" y="57.22" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="51.77" y="57.12" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="64.53" y="57.24" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="77.6" y="57.15" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="90.47" y="57.2" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="103.54" y="57.1" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="12.76" y="69.82" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="25.83" y="69.72" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="38.7" y="69.77" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="51.77" y="69.68" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="64.53" y="69.8" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="77.6" y="69.7" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="90.47" y="69.75" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="103.54" y="69.65" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="12.76" y="82.37" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="25.83" y="82.28" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="38.7" y="82.33" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="51.77" y="82.23" width="7.99" height="7.52" rx="0.47"/><rect style={{fill: color,stroke: color}} className="schedule-cls-3" x="64.53" y="82.35" width="7.99" height="7.52" rx="0.47"/><rect style={{stroke: color}} className="schedule-cls-4" x="22.25" y="2.5" width="2.28" height="21.68" rx="1.06"/><rect style={{stroke: color}} className="schedule-cls-4" x="99.86" y="2.5" width="2.28" height="21.68" rx="1.06"/>
        </svg>
    );
}


const MessageIcon = ({
    color = '',
    width = 64,
    height = 64
}) => {
    return (
        <svg width={width} height={height} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 -5 102 80">
            <path style={{fill: color}} className="message-cls-1" d="M110,34V95H18V34h92m0-5H18a4.79,4.79,0,0,0-5,4.55v61.9A4.79,4.79,0,0,0,18,100h92a4.79,4.79,0,0,0,5-4.55V33.55A4.79,4.79,0,0,0,110,29Z" transform="translate(-13 -29)"/><path style={{fill: color}} className="message-cls-2" d="M38.5,48.5" transform="translate(-13 -29)"/><path style={{stroke: color}} className="message-cls-3" d="M18,32.47,64.26,78,111.5,31" transform="translate(-13 -29)"/><line style={{stroke: color}} className="message-cls-3" x1="35" y1="30" x2="5" y2="67.42"/><line style={{stroke: color}} className="message-cls-3" x1="67" y1="31" x2="98.5" y2="67.42"/>
        </svg>
    );
}


const NotificationsIcon = ({
    color = '',
    width = 64,
    height = 64
}) => {
    return (  
        <svg width={width} height={height} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74 88.5">
            <path style={{fill: color}} className="notification-cls-1" d="M63.5,26A19.53,19.53,0,0,1,83,45.5v32l4.24.65A10.39,10.39,0,0,1,96,88H32a10.38,10.38,0,0,1,8.07-9.74L44,77.39V45.5A19.53,19.53,0,0,1,63.5,26m0-5A24.5,24.5,0,0,0,39,45.5V73.38a15.34,15.34,0,0,0-12,15V93h74V88.34A15.32,15.32,0,0,0,88,73.2V45.5A24.5,24.5,0,0,0,63.5,21Z" transform="translate(-27 -21)"/><path style={{stroke: color}} className="notification-cls-2" d="M77,94a13,13,0,0,1-26,0" transform="translate(-27 -21)"/>
        </svg>
    );
}

const AbsenceIcon = ({
    color = '',
    width = 64,
    height = 64
}) => {
    return (
        <svg width={width} height={height} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 10 65 105">
            <line style={{stroke: color}} className="absence-cls-1" x1="18" y1="61.5" x2="57" y2="61.5"/>
            <path style={{fill: color}} className="absence-cls-2" d="M96,23v89H31V23h6.5V34.5h53V23H96m0-5H85.5V29.5h-43V18H31a5,5,0,0,0-5,5v89a5,5,0,0,0,5,5H96a5,5,0,0,0,5-5V23a5,5,0,0,0-5-5Z" transform="translate(-26 -7)"/>
            <path style={{fill: color}} className="absence-cls-2" d="M85.5,12V29.5h-43V12h43m5-5h-53V34.5h53V7Z" transform="translate(-26 -7)"/>
        </svg>
    );
}

export { HomeIcon, GradesIcon, ScheduleIcon, MessageIcon, NotificationsIcon, AbsenceIcon }