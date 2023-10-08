function loader(files, gamepath) {
    console.log(`Loading Game Files...`);
    files.forEach((file) => {
        const script = document.createElement('script');
        script.setAttribute(
            'src',
            gamepath + file.path,
        );

        script.setAttribute('async', '');

        script.onload = function handleScriptLoaded() {
            console.log(`game script ${file.name} has loaded`);
        };

        script.onerror = function handleScriptError() {
            console.log(`error loading game script ${file.name}`);
        };

        document.head.appendChild(script);
    });
}