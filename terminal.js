document.addEventListener('DOMContentLoaded', function () {
    const commands = [
        'whoami',
        'ls -la',
        'cat skills.txt',
        'git status',
        'npm start',
        'python app.py',
        'sudo systemctl status nginx'
    ];

    const outputs = [
        'rodrigo@dev-machine',
        'total 42\ndrwxr-xr-x  8 rodrigo rodrigo  4096 Dec 29 10:30 .\ndrwxr-xr-x  3 rodrigo rodrigo  4096 Dec 29 10:25 ..\n-rw-r--r--  1 rodrigo rodrigo   220 Dec 29 10:25 .bashrc\ndrwxr-xr-x  8 rodrigo rodrigo  4096 Dec 29 10:30 .git\n-rw-r--r--  1 rodrigo rodrigo  1024 Dec 29 10:30 README.md\ndrwxr-xr-x  2 rodrigo rodrigo  4096 Dec 29 10:30 src',
        'HTML5 & CSS3: ████████████████████ 90%\nShellScript: ████████████████████ 90%\nJavaScript: ████████████████████ 85%\nPython: ████████████████████ 80%\nPHP: ████████████████████ 78%\nRust: ████████████████████ 70%\nRuby: ████████████████████ 70%\nC#: ████████████████████ 73%',
        'On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean',
        '> portfolio@1.0.0 start\n> react-scripts start\n\nStarting the development server...\nCompiled successfully!\n\nLocal: http://localhost:3000',
        ' * Running on http://127.0.0.1:5000\n * Debug mode: on\n * Restarting with stat\n * Debugger is active!',
        '● nginx.service - A high performance web server\n   Loaded: loaded (/lib/systemd/system/nginx.service)\n   Active: active (running) since Mon 2025-06-29 10:00:00 UTC\n     Docs: man:nginx(8)\n Main PID: 1234 (nginx)\n    Tasks: 2 (limit: 4915)\n   Memory: 6.2M\n   CGroup: /system.slice/nginx.service'
    ];

    let currentCommandIndex = 0;
    let isTyping = false;

    function typeCommand() {
        if (isTyping) return;

        isTyping = true;
        const commandElement = document.getElementById('typing-command');
        const outputElement = document.getElementById('command-output');
        const command = commands[currentCommandIndex];

        // Limpa comando anterior
        commandElement.textContent = '';
        outputElement.innerHTML = '';

        // Digita o comando
        let i = 0;
        const typeInterval = setInterval(() => {
            commandElement.textContent += command[i];
            i++;

            if (i >= command.length) {
                clearInterval(typeInterval);

                // Mostra output após um delay
                setTimeout(() => {
                    outputElement.innerHTML = '<pre>' + outputs[currentCommandIndex] + '</pre>';

                    // Próximo comando após delay
                    setTimeout(() => {
                        currentCommandIndex = (currentCommandIndex + 1) % commands.length;
                        isTyping = false;

                        // Inicia próximo comando
                        setTimeout(typeCommand, 2000);
                    }, 3000);
                }, 500);
            }
        }, 100);
    }

    // Inicia o ciclo após um delay
    setTimeout(typeCommand, 2000);
});