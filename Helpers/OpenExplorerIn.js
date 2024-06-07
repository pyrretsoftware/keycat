function openExplorerin(path, callback) {
    var cmd = ``;
    switch (require(`os`).platform().toLowerCase().replace(/[0-9]/g, ``).replace(`darwin`, `macos`)) {
        case `win`:
            path = path || '=';
            cmd = `explorer`;
            break;
        case `linux`:
            path = path || '/';
            cmd = `xdg-open`;
            break;
        case `macos`:
            path = path || '/';
            cmd = `open`;
            break;
    }
    let p = require(`child_process`).spawn(cmd, [path]);
    p.on('error', (err) => {
        p.kill();
        return callback(err);
    });
}

module.exports = {openExplorerin}