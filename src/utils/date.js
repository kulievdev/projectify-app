class DateUtil {
    addMinutes(minutes) {
        const currentDate = new Date();
        const unixDate = currentDate.setMinutes(
            currentDate.getMinutes() + minutes
        );

        return new Date(unixDate);
    }
}

export const date = new DateUtil();
