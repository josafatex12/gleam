setInterval(function () {
    const textareas = $('.entry-method textarea');
    if (textareas !== undefined) {
        for (let index = 0; index < textareas.length; index++) {
            $(textareas[index]).change();
        }
    }

    const inputs = $('.entry-method input');
    if (inputs !== undefined) {
        for (let index = 0; index < inputs.length; index++) {
            $(inputs[index]).change();
        }
    }
}, 500);

function runGleamTool() {
    const buttonClickRun = $('#gleam-click-to-run');
    if (buttonClickRun) {
        const text = $('#gleam-click-to-run span').text();
        if (text.indexOf('Running') === -1) {
            $('#gleam-click-to-run span').text('Gleam AutoTune: Running...');
        }
    }
}
