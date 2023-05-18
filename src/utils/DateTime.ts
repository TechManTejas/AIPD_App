export const PerviousDate = (daysBack: number) => {
    const inputDate = new Date();

    const DaysBefore = new Date(inputDate.getTime());
    DaysBefore.setDate(inputDate.getDate() + daysBack);

    const DaysSplitToFormat = DaysBefore.toLocaleDateString().split("/")

    return DaysSplitToFormat[1] + "/" + DaysSplitToFormat[0];
}