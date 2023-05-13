export const PerviousDate = (daysBack: number) => {
    const inputDate = new Date();

    const DaysBefore = new Date(inputDate.getTime());
    DaysBefore.setDate(inputDate.getDate() - daysBack);

    return (DaysBefore.toLocaleDateString() );
}