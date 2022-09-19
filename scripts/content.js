window.onload = function () {
    if (isOnGleam()) {
        registerGleamPage();
    }

    if (isOnTwitter()) {
        registerTwitterPage();
    }

    if (isOnTele()) {
        registerTelePage();
    }

    if (isOnFacebook()) {
        registerFacebookPage();
    }

    if (isOnYoutube()) {
        registerYoutubePage();
    }

    if (isOnDiscord()) {
        registerDiscordPage();
    }

    if (isOnMedium()) {
        registerMediumPage();
    }
}

function registerGleamPage() {
    var isPre = false;
    chrome.storage.local.get(['activationCode'], function(result) {
        if (result.activationCode && result.activationCode.length > 0) {
                isPre = true;
        }
    });

    setTimeout(() => {
        finishRun();
        let script = document.createElement("script");
        script.src = chrome.runtime.getURL('scripts/resources/gleam.js');
        (document.documentElement).appendChild(script);

        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = chrome.runtime.getURL('styles/gleam.css');
        (document.documentElement).appendChild(link);

        $(".entry-heading").after('<div style="padding-top: 5px;padding-bottom: 5px;text-align: center;"><button id="gleam-click-to-run" type="button" class="button button--loading" onclick="runGleamTool()"><span class="button__text">Gleam AutoTune: Running...</span></button></div>');
        chrome.storage.local.get(['accountInfor'], function(result) {
            if (result.accountInfor && result.accountInfor.walletAddress) {
                const walletAddress = result.accountInfor.walletAddress;
                const telegramSupport = isPre ? result.accountInfor.telegramSupport : false;
                const telegramAccount = isPre ? result.accountInfor.teleAccount : '';
                const discordSupport = isPre ? result.accountInfor.discordSupport : false;
                const facebookSupport = isPre ? result.accountInfor.facebookSupport : false;
                const youtubeSupport = isPre ? result.accountInfor.youtubeSupport : false;
                // scroll to bottom
                scrollToBottom();

                const followTwitter = [];
                const followTele = [];
                const taskList = $('.entry-method');
                if (taskList && taskList.length > 0) {
                    for (let index = 0; index < taskList.length; index++) {
                        const methodTitle = taskList[index].getElementsByClassName('entry-method-title')[0];
                        const title = methodTitle.innerText.toLowerCase();
                        if (title.indexOf('follow') !== -1 && title.indexOf('twitter') !== -1) {
                            if (title.indexOf('@') !== -1) {
                                const splitTitle = title.split(' ');
                                splitTitle.forEach(tw => {
                                    if (tw.indexOf('@') !== -1) {
                                        followTwitter.push(tw.substring(1));
                                    }
                                });
                            } else {
                                const alinks = taskList[index].getElementsByTagName('a');
                                if (alinks && alinks.length > 0) {
                                    for (let index = 0; index < alinks.length; index++) {
                                        if (alinks[index].href.includes('https://t.me')) {
                                            const alinkArray = alinks[index].href.split('/');
                                            if (alinkArray.length === 4) {
                                                followTele.push(alinkArray[3]);
                                            }
                                        } else if (alinks[index].href.includes('https://twitter.com')) {
                                            const alinkArray = alinks[index].href.split('/');
                                            if (alinkArray.length === 4) {
                                                followTwitter.push(alinkArray[3]);
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if ((title.indexOf('join') !== -1 || title.indexOf('follow') !== -1) && title.indexOf('telegram') !== -1) {
                            if (title.indexOf('@') !== -1) {
                                const splitTitle = title.split(' ');
                                splitTitle.forEach(tl => {
                                    if (tl.indexOf('@') !== -1) {
                                    followTele.push(tl.substring(1));
                                    }
                                });
                            } else {
                                const alinks = taskList[index].getElementsByTagName('a');
                                if (alinks && alinks.length > 0) {
                                    for (let index = 0; index < alinks.length; index++) {
                                        if (alinks[index].href.includes('https://t.me')) {
                                            const alinkArray = alinks[index].href.split('/');
                                            if (alinkArray.length === 4) {
                                                followTele.push(alinkArray[3]);
                                            }
                                        }
                                    }
                                }
                            }
                        } 

                        if (title.indexOf('retweet') !== -1 && title.indexOf('twitter') !== -1) {
                            const retweetLink = taskList[index].getElementsByClassName('entry-method-title')[0].getElementsByTagName('a')[0].href;
                            const postId = retweetLink.substring(retweetLink.indexOf('/status/') + 8, retweetLink.indexOf('?s='));
                            if (retweetLink !== undefined) {
                                window.open(`https://twitter.com/intent/retweet?tweet_id=` + postId);
                            }
                        }

                        if (title.indexOf('like') !== -1 || title.indexOf('visit') !== -1 || title.indexOf('tweet') !== -1 || title.indexOf('join') !== -1
                        || title.indexOf('follow') !== -1) {
                            const expandable = taskList[index].getElementsByClassName('expandable');
                            if (expandable && expandable.length > 0) {
                                const alinks = expandable[0].getElementsByTagName('a');
                                if (alinks && alinks.length > 0) {
                                    const tweetLink = alinks[0].href;
                                    if (title.indexOf('visit') !== -1 || title.indexOf('retweet') !== -1
                                    || title.indexOf('follow') !== -1) {
                                        alinks[0].click();
                                    }

                                    if (isPre && discordSupport && tweetLink.indexOf('discord') !== -1) {
                                        alinks[0].click();
                                    }

                                    if (isPre && youtubeSupport && tweetLink.indexOf('youtube') !== -1) {
                                        alinks[0].click();
                                    }

                                    if (isPre && facebookSupport && tweetLink.indexOf('facebook') !== -1) {
                                        alinks[0].click();
                                    }
                                    
                                    if (taskList[index].getElementsByTagName('textarea').length > 0) {
                                        $(taskList[index].getElementsByTagName('textarea')[0]).val(tweetLink);
                                    }

                                    if (taskList[index].getElementsByTagName('input').length > 0) {
                                        $(taskList[index].getElementsByTagName('input')[0]).val(tweetLink);
                                    }

                                    setTimeout(() => {
                                        if (taskList[index].getElementsByClassName('btn-primary').length > 0) {
                                            taskList[index].getElementsByClassName('btn-primary')[0].click();
                                        }
                                    }, 1000);
                                }
                            }
                        }

                        // input wallet + tele
                        if (title.indexOf('wallet') !== -1 || title.indexOf('telegram') !== -1) {
                            const textareaValue = title.indexOf('wallet') !== -1 ? walletAddress : telegramAccount;
                            taskList[index].getElementsByClassName('entry-method-title')[0].click();
                            scrollToBottom();
                            const textareas = taskList[index].getElementsByTagName('textarea');
                            if (textareas && textareas.length > 0) {
                                $(textareas[0]).val(textareaValue);
                                setTimeout(() => {
                                    if (taskList[index].getElementsByClassName('btn-primary').length > 0) {
                                        taskList[index].getElementsByClassName('btn-primary')[0].click();
                                    }
                                }, 1000);
                            } else {
                                const input = taskList[index].getElementsByTagName('input');
                                if (input && input.length > 0) {
                                    $(input[0]).val(textareaValue);
                                    setTimeout(() => {
                                        if (taskList[index].getElementsByClassName('btn-primary').length > 0) {
                                            taskList[index].getElementsByClassName('btn-primary')[0].click();
                                        }
                                    }, 1000);
                                }
                            }
                        }
                    }

                    // Action follow Twitter
                    openTwitterPages(followTwitter);

                    // Action join Tele
                    if (isPre && telegramSupport) {
                        openTelePages(followTele);
                    }

                    // Check result
                    var delayTime = 10000;
                    chrome.storage.local.get(['setting'], function(result) {
                        if (result.setting) {
                            if (result.setting.speedValue) {
                                const speedValue = result.setting.speedValue;
                                switch (speedValue) {
                                    case "1":
                                        delayTime = 20000;
                                        break;
                                    case "2":
                                        delayTime = 10000;
                                        break;
                                    case "3":
                                        delayTime = 5000;
                                    break;
                                    default:
                                        break;
                                }
                            }
                        }

                        setTimeout(() => {
                            checkResult();
                            setTimeout(() => {
                                checkResult();
                            }, delayTime);
                        }, delayTime);
                    });
                }
            }
        });
    }, 3000);
}

async function openTwitterPages(followTwitter) {
    if (followTwitter.length > 0) {
        followTwitter.filter(onlyUnique).forEach(twAccount => {
            //await sleep(500);
            setTimeout(() => {
                window.open(`https://twitter.com/intent/follow?screen_name=${twAccount}`);
            }, 500);
        });
    }
}

async function openTelePages(followTele) {
    if (followTele.length > 0) {
        followTele.filter(onlyUnique).forEach(teleAccount => {
            //await sleep(500);
            setTimeout(() => {
                window.open(`https://web.telegram.org/k/#?tgaddr=tg%3A%2F%2Fresolve%3Fdomain%3D${teleAccount}`);
            }, 500);
        });
    }
}

async function checkResult() {
    const taskList = $('.entry-method');
    for (let index = 0; index < taskList.length; index++) {
        await sleep(800);
        const methodTitle = taskList[index].getElementsByClassName('entry-method-title')[0];
        const title = methodTitle.innerText.toLowerCase();
        if (title.indexOf('enter using telegram') === -1 && title.indexOf('refer') === -1) {
            setTimeout(() => {
                taskList[index].getElementsByTagName('a')[0].click();
                setTimeout(() => {
                    if (taskList[index].getElementsByClassName('btn-primary').length > 0) {
                        taskList[index].getElementsByClassName('btn-primary')[0].click();
                    }
                }, 500);
            }, 500);
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function scrollToBottom() {
    const footer = $(".entry-footer")[0];
    footer.scrollIntoView();
}

function registerTwitterPage() {
    setTimeout(() => {
        const tweet = $('[data-testid="tweetButton"]');
        if (tweet !== undefined) {
            tweet.click();
            setTimeout(() => {
                const toast = $('[data-testid="toast"]');
                if (toast && toast.length > 0) {
                    const links = toast[0].getElementsByTagName('a');
                    if (links && links.length > 0) {
                        const sharedLink = links[0].href;
                        if (sharedLink) {
        
                        }
                    }
                }
            }, 3000);
            closeWindows();
        }
        // Follow
        const followButton = $('[data-testid="confirmationSheetConfirm"]');
        if (followButton !== undefined) {
            if (followButton.length > 0) {
                followButton[0].click();
            } else {
                followButton.click();
            }
            closeWindows();
        }

        // Retweet
        // const retweet = $('article [aria-label="Retweet"]');
        // if (retweet !== undefined) {
        //     retweet.click();
        //     setTimeout(() => {
        //         $('[data-testid="retweetConfirm"]').click();
        //         setTimeout(() => {
        //             window.close();
        //         }, 500);
        //     }, 500);
        // }
    }, 5000);
}

function registerTelePage() {
    if (window.location.origin.match('oauth.telegram')) {
        setTimeout(() => {
            forceCloseWindows(1000);
        }, 1000);
    } else {
        setTimeout(() => {
            $('.chat-utils .btn-primary').click();
            closeWindows();
        }, 3000);
    }
}

function registerYoutubePage() {
    setTimeout(() => {
        chrome.storage.local.get(['accountInfor'], function(result) {
            if (result.accountInfor && result.accountInfor.walletAddress) {
                const youtubeSupport = result.accountInfor.youtubeSupport;
                if (youtubeSupport) {
                    if ($('ytd-subscribe-button-renderer') && $('tp-yt-paper-button').length > 0) {
                        if ($('tp-yt-paper-button').length > 0) {
                            for (let index = 0; index < $('tp-yt-paper-button').length; index++) {
                                const element = $('tp-yt-paper-button')[index];
                                if (element && element.textContent.toLowerCase().indexOf('đăng ký') !== -1 &&
                                element.textContent.toLowerCase().indexOf('đã đăng ký') === -1) {
                                    const content = element.textContent.toLowerCase();
                                    if (content && ((content.indexOf('đăng ký') !== -1 && content.indexOf('đã đăng ký') === -1) || (content.indexOf('subscribe') !== -1
                                    && content.indexOf('subscribed') === -1))) {
                                        element.click();
                                    }
                                }
                            }
                        } else {
                            $('tp-yt-paper-button').click();
                        }
                    }
                }
            }
        });
    }, 1000);
    
    closeWindows();
}

function registerFacebookPage() {
    chrome.storage.local.get(['accountInfor'], function(result) {
        if (result.accountInfor && result.accountInfor.walletAddress) {
            const facebookSupport = result.accountInfor.facebookSupport;
            if (facebookSupport) {
                closeWindows();
            }
        }
    });
}

function registerMediumPage() {
    setTimeout(() => {
        chrome.storage.local.get(['accountInfor'], function(result) {
            if (result.accountInfor && result.accountInfor.walletAddress) {
                const mediumSupport = result.accountInfor.mediumSupport;
                if (mediumSupport) {
                    const buttons = document.getElementsByTagName('button');
                    if (buttons && buttons.length > 0) {
                        for (let index = 0; index < buttons.length; index++) {
                            const button = buttons[index];
                            if (button && button.textContent === 'Follow') {
                                button.click();
                            }
                        }
                    }
                    closeWindows();
                }
            }
        });
        
    }, 5000);
}

function registerDiscordPage() {
    setTimeout(() => {
        chrome.storage.local.get(['accountInfor'], function(result) {
            if (result.accountInfor && result.accountInfor.walletAddress) {
                const discordSupport = result.accountInfor.discordSupport;
                if (discordSupport) {
                    const acceptButtons = $('button');
                    if (acceptButtons && acceptButtons.length > 0 && acceptButtons[0].textContent === 'Accept Invite') {
                        acceptButtons[0].click();
                    }
                    closeWindows();
                }
            }
        });
        
    }, 3000);
}


function isOnGleam() {
    return window.location.origin.match('gleam');
}

function isOnTwitter() {
    return window.location.origin.match('twitter');
}

function isOnTele() {
    return window.location.origin.match('telegram');
}

function isOnFacebook() {
    return window.location.origin.match('facebook');
}

function isOnYoutube() {
    return window.location.origin.match('youtube');
}

function isOnMedium() {
    return window.location.origin.match('medium');
}

function isOnDiscord() {
    return window.location.origin.match('discord');
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function closeWindows(delayTime = 2000) {
    chrome.storage.local.get(['setting'], function(result) {
        if (result.setting) {
            if (result.setting.closeSubwindows) {
                const speedValue = result.setting.speedValue;
                switch (speedValue) {
                    case "1":
                        delayTime = 20000;
                        break;
                    case "2":
                        delayTime = 10000;
                        break;
                    case "3":
                        delayTime = 5000;
                    break;
                    default:
                        break;
                }
                setTimeout(() => {
                    window.close();
                }, delayTime);
            }
        }
    });
}

function forceCloseWindows(delayTime = 1000) {
    setTimeout(() => {
        window.close();
    }, delayTime);
}

function finishRun() {
    setTimeout(() => {
        const buttonClickRun = $('#gleam-click-to-run');
        if (buttonClickRun) {
            $('#gleam-click-to-run span').text('Gleam AutoTune: Completed');
        }
    }, 30000);
}