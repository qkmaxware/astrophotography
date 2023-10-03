async function preprocess() {
    await require("./_preprocessor/thumbnails").process();
    await require("./_preprocessor/datafiles").process();
}
preprocess();