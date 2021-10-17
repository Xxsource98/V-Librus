const Librus = require('librus-api');
 
class librusData {
    constructor() {
        this.librusData = new Librus();
        this.username = "";
        this.password = "";
    }

    fetchData() {
        return new Promise(async (resolve, reject) => {
            const todayDate = new Date();
            const previousDate = new Date();
            const nextDate = new Date();

            previousDate.setDate(todayDate.getDate() - 7);
            nextDate.setDate(todayDate.getDate() + 7);

            const dataToSend = {
                grades: null,
                accountInfo: null,
                messages: null,
                absences: null,
                calendar: {
                    absences: [],
                    appealAndShifts: [],
                    tests: []
                },
                schedule: {
                    previousWeek: null,
                    currentWeek: null,
                    nextWeek: null
                },
                notifications: null,
                luckyNumber: {
                    when: "",
                    number: 0,
                    amILucky: false
                }
            }

            const transformDateToValidString = (date) => {
                return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}` // slice is for get xxxx-xx-xx date
            }

            const getMondayFridayDate = (date) => {
                let mondayDate = new Date(date);
                let fridayDate = new Date(date);

                let day = date.getDay();
                let monday = date.getDate() - day + (day == 0 ? -6 : 1);
                mondayDate.setDate(monday);
                fridayDate.setDate(monday + 4);

                return {
                    monday: transformDateToValidString(mondayDate),
                    friday: transformDateToValidString(fridayDate)
                }
            }

            const getRangeInDays = (date) => {
                const firstDate = date.substring(0, date.indexOf(' -'));
                const secondDate = date.substring(date.indexOf('- ') + 2, date.length);

                const fDate = new Date(firstDate);
                const sDate = new Date(secondDate);

                return  Math.floor((Date.parse(sDate) - Date.parse(fDate)) / 86400000);
            }

            const getFirstRangeDate = (dateString) => { // Transform from '2021-09-03 - 2021-09-03' to '2021-09-03'
                let index = dateString.indexOf(' -');

                return dateString.substring(0, index);
            }

            const increaseDate = (date, i) => {
                const curDate = new Date(date);
                curDate.setDate(curDate.getDate() + i);

                return curDate.toISOString().slice(0, 10);
            }

            const currentWeek = getMondayFridayDate(todayDate);
            const lastWeek = getMondayFridayDate(previousDate);
            const nextWeek = getMondayFridayDate(nextDate);

            await this.librusData.info.getGrades().then(data => { 
                let returnData = [];

                for (const subject of data) {
                    let grades = {
                        subject: subject.name,
                        semester1: {
                            normal: [],
                            final: ""
                        },
                        semester2: {
                            normal: [],
                            final: ""
                        },
                    }

                    // Semester 1
                    const semester1 = subject.semester[0];
                    for (const grade of semester1.grades) {
                        const gradeID = grade.id;

                        this.librusData.info.getGrade(gradeID).then(gradeData => {
                            grades.semester1.normal.push(gradeData);
                        });
                    }

                    // Semester 1 Final
                    const semester1f = subject.semester[1];
                    for (const grade of semester1f.grades) {
                        const gradeID = grade.id;

                        this.librusData.info.getGrade(gradeID).then(gradeData => {
                            grades.semester1.final = gradeData;
                        });
                    }

                    // Semester 2
                    const semester2 = subject.semester[2];
                    for (const grade of semester2.grades) {
                        const gradeID = grade.id;

                        this.librusData.info.getGrade(gradeID).then(gradeData => {
                            grades.semester2.normal.push(gradeData);
                        });
                    }

                    // Semester 2 Final
                    const semester2f = subject.semester[3];
                    for (const grade of semester2f.grades) {
                        const gradeID = grade.id;

                        this.librusData.info.getGrade(gradeID).then(gradeData => {
                            grades.semester2.final = gradeData;
                        });
                    }

                    returnData.push(grades);
                }

                dataToSend.grades = returnData; 
            });
            await this.librusData.info.getAccountInfo().then(data => dataToSend.accountInfo = data);
            await this.librusData.absence.getAbsences().then(data => dataToSend.absences = data);
            
            const getEventData = async event => { // Fix on Windows
                let type = "unknown";
                let returnData = event;

                await this.librusData.calendar.getEvent(event.id, true).then(retData => {
                    if (retData !== 0) {
                        type = "absence";
                        returnData = retData;
                    }
                }).catch(ex => { if (ex !== null) return });

                await this.librusData.calendar.getEvent(event.id).then(retData => {
                    if (retData !== 0) {
                        type = "test";
                        returnData = retData;
                    }
                }).catch(ex => { if (ex !== null) return });

                return {
                    type: type,
                    data: returnData
                }
            }

            let bannedTeachers = []; // Array for teacher who has range more than 0 in been absenced
            let bannedSingleTeachersDates = []; // Detect if the same day has more than 1 absence and just make it one

            const getCalendarData = async () => {
                const promises = [];

                promises.push(this.librusData.calendar.getCalendar(todayDate.getMonth() + 1).then(async data => {
                    for (const day of data) {
                        for (const event of day) {
                            getEventData(event).then(retData => {
                                const type = retData.type;
                                const obj = retData.data;
    
                                if (type === "absence") {
                                    const rangeDays = getRangeInDays(obj.range);
                                    if (obj.added === undefined) return;

                                    if (rangeDays > 0) {
                                        if (bannedTeachers.indexOf(obj.teacher) !== -1) return;
                                        else bannedTeachers.push(obj.teacher);       
                                            
                                        for (let i = 0; i < rangeDays + 1; i++) {
                                            dataToSend.calendar.absences.push({
                                                msgID: event.id,
                                                teacher: obj.teacher,
                                                range: obj.range,
                                                date: increaseDate(getFirstRangeDate(obj.range), i),
                                                added: increaseDate(obj.added, i)
                                            });
                                        }
                                    }
                                    else {
                                        const index = bannedSingleTeachersDates.map(data => { 
                                            return `${data.name}:${data.date}`;
                                        }).indexOf(`${obj.teacher}:${getFirstRangeDate(obj.range)}`);
    
                                        if (index !== -1) { 
                                            return;
                                        }
                                        else bannedSingleTeachersDates.push({
                                            name: obj.teacher,
                                            date: getFirstRangeDate(obj.range),
                                        })
    
                                        dataToSend.calendar.absences.push({
                                            msgID: event.id,
                                            teacher: obj.teacher,
                                            range: obj.range,
                                            date: getFirstRangeDate(obj.range),
                                            added: obj.added
                                        });
                                    }
                                }
    
                                if (type === "test") {
                                    dataToSend.calendar.tests.push({
                                        msgID: event.id,
                                        date: obj.date,
                                        lessonIndex: obj.lessonIndex,
                                        lesson: obj.lesson,
                                        teacher: obj.teacher,
                                        type: obj.type,
                                        description: obj.description,
                                        added: obj.added
                                    });
                                }
    
                                if (type === "unknown") {
                                    dataToSend.calendar.appealAndShifts.push({
                                        msgID: obj.id,
                                        date: obj.day,
                                        title: obj.title
                                    });
                                }
                            });
                        }
                    }
                }));

                promises.push(this.librusData.calendar.getCalendar(todayDate.getMonth() + 2).then(async data => {
                    for (const day of data) {
                        for (const event of day) {
                            getEventData(event).then(retData => {
                                const type = retData.type;
                                const obj = retData.data;
    
                                if (type === "absence") {
                                    const rangeDays = getRangeInDays(obj.range);
                                    if (obj.added === undefined) return;

                                    if (rangeDays > 0) {
                                        if (bannedTeachers.indexOf(obj.teacher) !== -1) return;
                                        else bannedTeachers.push(obj.teacher);                                
    
                                        for (let i = 0; i < rangeDays + 1; i++) {
                                            dataToSend.calendar.absences.push({
                                                msgID: event.id,
                                                teacher: obj.teacher,
                                                range: obj.range,
                                                date: increaseDate(getFirstRangeDate(obj.range), i),
                                                added: increaseDate(obj.added, i)
                                            });
                                        }
                                    }
                                    else {
                                        const index = bannedSingleTeachersDates.map(data => { 
                                            return `${data.name}:${data.date}`;
                                        }).indexOf(`${obj.teacher}:${getFirstRangeDate(obj.range)}`);
    
                                        if (index !== -1) { 
                                            return;
                                        }
                                        else bannedSingleTeachersDates.push({
                                            name: obj.teacher,
                                            date: getFirstRangeDate(obj.range),
                                        })
    
                                        dataToSend.calendar.absences.push({
                                            msgID: event.id,
                                            teacher: obj.teacher,
                                            range: obj.range,
                                            date: getFirstRangeDate(obj.range),
                                            added: obj.added
                                        });
                                    }
                                }
    
                                if (type === "test") {
                                    dataToSend.calendar.tests.push({
                                        msgID: event.id,
                                        date: obj.date,
                                        lessonIndex: obj.lessonIndex,
                                        lesson: obj.lesson,
                                        teacher: obj.teacher,
                                        type: obj.type,
                                        description: obj.description,
                                        added: obj.added
                                    });
                                }
    
                                if (type === "unknown") {
                                    dataToSend.calendar.appealAndShifts.push({
                                        msgID: obj.id,
                                        date: obj.day,
                                        title: obj.title
                                    });
                                }
                            });
                        }
                    }
                }));

                return Promise.all(promises);
            }

            await getCalendarData();
            
            await this.librusData.calendar.getTimetable(currentWeek.monday, currentWeek.friday).then(calendarData => {
                dataToSend.schedule.currentWeek = calendarData;
                dataToSend.schedule.currentWeek.currentWeekString = `${currentWeek.monday} - ${currentWeek.friday}`;
            });
            await this.librusData.calendar.getTimetable(lastWeek.monday, lastWeek.friday).then(calendarData => {
                dataToSend.schedule.previousWeek = calendarData;
                dataToSend.schedule.previousWeek.currentWeekString = `${lastWeek.monday} - ${lastWeek.friday}`;
            });
            await this.librusData.calendar.getTimetable(nextWeek.monday, nextWeek.friday).then(calendarData => {
                dataToSend.schedule.nextWeek = calendarData;
                dataToSend.schedule.nextWeek.currentWeekString = `${nextWeek.monday} - ${nextWeek.friday}`;
            });

            await this.librusData.inbox.listAnnouncements().then(data => dataToSend.notifications = data);
            
            await this.librusData.inbox.listInbox(5).then(async data => dataToSend.messages = data);

            await this.librusData.info.getLuckyNumber().then(data => {
                const luckyNumber = parseInt(data);
                const studentNumber = parseInt(dataToSend.accountInfo.student.index);

                const date6pm = new Date(todayDate);
                date6pm.setHours(18, 0, 0, 0);

                if (studentNumber === luckyNumber) {
                    if (todayDate.getTime() > date6pm.getTime()) {
                        dataToSend.luckyNumber.when = "Tomorrow";
                    }
                    else {
                        dataToSend.luckyNumber.when = "Today";
                    }

                    dataToSend.luckyNumber.amILucky = true;
                }

                dataToSend.luckyNumber.number = data;
            });

            resolve(dataToSend);
        });
    }
    
    login(login, password) {
        return new Promise((resolve, reject) => {
            this.librusData.authorize(login, password).then(() => {
                this.username = login;
                this.password = password;
                resolve(this.librusData);
            }).catch(ex => reject(ex));
        })
    }

    getLoginData() {
        return {
            user: this.username,
            pass: this.password
        }
    }

    refreshData() {
        this.librusData = new Librus();
    }

    async getMessageData(messageID) {
        return new Promise(async (resolve, reject) => {
            await this.librusData.inbox.getMessage(5, messageID).then(async messageData => {
                if (messageData.html === undefined) {
                    await this.login(this.username, this.password).then(async lData => {
                        resolve(this.getMessageData(messageID));
                    });
                }
                else 
                    resolve(messageData);
            }).catch(ex => {
                reject(ex);
            });
        })  
    }
}

module.exports = librusData;