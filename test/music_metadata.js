//
// const music_metadata = require('music-metadata')
// const util = require('util')
//
// console.log(music_metadata)
//
//
// async function main() {
//     try {
//         const filePath = 'F:\\Music\\ChiliChill - 时光盲盒.flac';
//         console.log('Parsing metadata...')
//         const metadata = await music_metadata.loadMusicMetadata(filePath);
//
//         // Output the parsed metadata to the console in a readable format
//         console.log(util.inspect(metadata, { showHidden: false, depth: null }));
//     } catch (error) {
//         console.error('Error parsing metadata:', error.message);
//     }
// }
// main()


import { parseFile } from 'music-metadata';
import { inspect } from 'util';

(async () => {
    try {
        const filePath = 'F:\\Music\\ChiliChill - 时光盲盒.flac';
        const metadata = await parseFile(filePath);

        // Output the parsed metadata to the console in a readable format
        console.log(inspect(metadata, { showHidden: false, depth: null }));
    } catch (error) {
        console.error('Error parsing metadata:', error.message);
    }
})();