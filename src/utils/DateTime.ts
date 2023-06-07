export const PerviousDate = (daysBack: number) => {
    const inputDate = new Date();
    const DaysBefore = new Date(inputDate.getTime());
    DaysBefore.setDate(inputDate.getDate() + daysBack);
    const DaysSplitToFormat = DaysBefore.toLocaleDateString().split("/")
    return DaysSplitToFormat[1] + "/" + DaysSplitToFormat[0];
}

export const getDateWithFormat = () => {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var day = String(currentDate.getDate()).padStart(2, '0');
    var formattedDate = year + '-' + month + '-' + day;
    return formattedDate
}