$(document).ready(function () {
    activeTab();
    chrome.storage.local.get(['activationCode'], function(result) {
        if (result.activationCode && result.activationCode.length > 0) {
            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', 'https://us-central1-gleam-autotune.cloudfunctions.net/checkGleamKey?key=' + result.activationCode);
            xhttp.onload = function() {
                const res = JSON.parse(xhttp.responseText);
                var isDisabled = true;
                var dayLeft = 0;
                if (res && res.result) {
                    const expiredDate = new Date(res.result.expiredDate);
                    dayLeft = Math.round((expiredDate.getTime() - (new Date).getTime()) / (1000 * 3600 * 24));
                    if (dayLeft >= 0) {
                        isDisabled = false;
                    }
                }

                if (!isDisabled) {
                    $('#upgrade-secion').hide();
                    $('#app-infor').html(`Gleam AutoTune v1.0 - Premium (${dayLeft} days left)`);
                    $('#current-version').attr('src', 'images/pro.png');
                    // account information
                    chrome.storage.local.get(['accountInfor'], function(result) {
                        if (result.accountInfor) {
                            $('#address-wallet').val(result.accountInfor.walletAddress);
                            $('#telegram-account').val(result.accountInfor.teleAccount);
                            $("#discord-support").prop('checked', result.accountInfor.discordSupport).trigger('change');
                            $("#facebook-support").prop('checked', result.accountInfor.facebookSupport).trigger('change');
                            $("#youtube-support").prop('checked', result.accountInfor.youtubeSupport).trigger('change');
                            $("#medium-support").prop('checked', result.accountInfor.mediumSupport).trigger('change');
                            $("#telegram-support").prop('checked', result.accountInfor.telegramSupport).trigger('change');
                        }
                    });

                    // setting
                    chrome.storage.local.get(['setting'], function(result) {
                        if (result.setting) {
                            $('#speedValue').val(result.setting.speedValue);
                            $("#close-subwindows").prop('checked', result.setting.closeSubwindows).trigger('change');
                            $("#auto-run").prop('checked', result.setting.autoRun).trigger('change');
                            $("#close-windows").prop('checked', result.setting.closeWindows).trigger('change');
                            changeSpeedText();
                        }
                    });
                } else {
                    saveActiveCodeToLocalStore('');
                }
                $('#discord-support').prop("disabled", isDisabled);
                $('#facebook-support').prop("disabled", isDisabled);
                $('#youtube-support').prop("disabled", isDisabled);
                $('#medium-support').prop("disabled", isDisabled);
                $('#telegram-support').prop("disabled", isDisabled);

                $('#speedValue').prop("disabled", isDisabled);
                $('#close-subwindows').prop("disabled", isDisabled);
                //$('#auto-run').prop("disabled", false);
                $('#close-windows').prop("disabled", isDisabled);
                $('#save-setting').prop("disabled", isDisabled);
            };
            xhttp.send();
        }
    });
});

$(document).on('click', '#save-account-information', function () {
    $('#cw-loading').show();
    chrome.storage.local.get(['activationCode'], function(result) {
        var isPre = false;
        if (result.activationCode && result.activationCode.length > 0) {
            isPre = true;
        }

        const accountInfor = {
            walletAddress: $('#address-wallet').val(),
            discordSupport: isPre ? $('#discord-support').is(':checked') : false,
            facebookSupport: isPre ? $('#facebook-support').is(':checked') : false,
            youtubeSupport: isPre ? $('#youtube-support').is(':checked') : false,
            mediumSupport: isPre ? $('#medium-support').is(':checked') : false,
            telegramSupport: isPre ? $('#telegram-support').is(':checked') : false,
            teleAccount: isPre ? $('#telegram-account').val() : ''
        };
        
        chrome.storage.local.set({ accountInfor: accountInfor }, function() {
            console.log('Account Information updated');
            setTimeout(() => {
                $('#cw-loading').hide();
            }, 500);
        });
    });
});

$(document).on('click', '#save-setting', function () {
    $('#setting-loading').show();
    chrome.storage.local.get(['activationCode'], function(result) {
        var isPre = false;
        if (result.activationCode && result.activationCode.length > 0) {
            isPre = true;
        }

        const setting = {
            speedValue: isPre ? $('#speedValue').val() : '2',
            autoRun: isPre ? $('#auto-run').is(':checked') : false,
            closeSubwindows: isPre ? $('#close-subwindows').is(':checked') : false,
            closeWindows: isPre ? $('#close-windows').is(':checked') : false,
        };
        
        chrome.storage.local.set({ setting: setting }, function() {
            console.log('Setting Information updated');
            setTimeout(() => {
                $('#setting-loading').hide();
            }, 500);
        });
    });
});

$(document).on('click', '#cw-tab', function () {
    $('#page-title').html('Account Information');
});

$(document).on('click', '#tk-tab', function () {
    $('#page-title').html('Read Me');
});

$(document).on('click', '#cw-setting', function () {
    $('#page-title').html('Setting');
});

$(document).on('click', '#clear-all', function () {
    window.close();
});

$(document).on('click', '#submit-activation-code', function () {
    $('#activation-code-loading').show();
    $('#invalid-code').hide();
    const code = $('#activation-code').val();
    checkKey(code);
});

$(document).on('change', '#telegram-support', function () {
    const checked = $('#telegram-support').is(':checked');
    if (checked) {
        $('#group-telegram-account').show();
        $('#telegram-account').focus();
        //$('#telegram-account').prop("disabled", false);
    } else {
        $('#group-telegram-account').hide();
        //$('#telegram-account').prop("disabled", true);
        $('#telegram-account').val('');
    }
});

function saveActiveCodeToLocalStore(activationCode) {
    chrome.storage.local.set({ activationCode: activationCode }, function() {
        if (activationCode) {
            setTimeout(() => {
                const accountInfor = {
                    walletAddress: '',
                    discordSupport: true,
                    facebookSupport: true,
                    youtubeSupport: true,
                    mediumSupport: true,
                    telegramSupport: true,
                    teleAccount: ''
                };
                chrome.storage.local.set({ accountInfor: accountInfor }, function() {
                    console.log('Account Information updated');
                });
    
                const setting = {
                    speedValue: '2',
                    closeSubwindows: true,
                    closeWindows: true,
                };
                
                chrome.storage.local.set({ setting: setting }, function() {
                    console.log('Setting Information updated');
                });
    
                setTimeout(() => {
                    location.reload();
                }, 300);
            }, 500);
        }
    });
}

function activeTab() {
    $('#cw-tab').addClass('active');
    $('#cw-content').addClass('show active');
    $('#page-title').html('Account Information');
}

function checkKey(key) {
    if (!key) {
        $('#activation-code-loading').hide();
        $('#invalid-code').show();
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'https://us-central1-gleam-autotune.cloudfunctions.net/checkGleamKey?key=' + key);
    xhttp.onload = function() {
        const res = JSON.parse(xhttp.responseText);
        if (res && res.result) {
            const expiredDate = new Date(res.result.expiredDate);
            const dayLeft = Math.round((expiredDate.getTime() - (new Date).getTime()) / (1000 * 3600 * 24));
            if (dayLeft >= 0) {
                saveActiveCodeToLocalStore(key)
            } else {
                $('#invalid-code').show();
            }
            
            $('#activation-code-loading').hide();
        } else {
            $('#activation-code-loading').hide();
            $('#invalid-code').show();
        }
    };
    xhttp.send();
}

$(document).on('change', '#speedValue', function () {
    changeSpeedText();
});

function changeSpeedText() {
    const speedValue = parseInt($('#speedValue').val());
    var speedText = 'Normal';
    if (speedValue === 1) {
        speedText = 'Slow';
    }

    if (speedValue === 3) {
        speedText = 'Fast';
    }

    $('#speedText').html(`${speedText}`);
}