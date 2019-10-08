export function showAlert(body, title, actionFunc, actionTitle, actionFunc2, actionTitle2) {
    return {
        type: "SHOW_ALERT",
        body,
        title,
        actionFunc,
        actionTitle,
        actionFunc2,
        actionTitle2
    };
}

export function closeAlert() {
    return {
        type: "CLOSE_ALERT"
    };
}
