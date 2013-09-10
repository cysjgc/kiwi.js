/**
* Kiwi - Files
* @module Kiwi
* @submodule Files 
* 
*/

module Kiwi.Files {

    /**
    *
    * @class Loader
    *
    */
    export class Loader {

        /**
        * 
        * @constructor
        * @param {Kiwi.Game} game
        * @return {Loader} This Object
        */
        constructor(game: Kiwi.Game) {

            this._game = game;

        }

        public objType() {
            return "Loader";
        }

        /**
        * 
        * @property _game
        * @type Kiwi.Game
        * @private
        */
        private _game: Kiwi.Game;

        /**
        * 
        * @property _fileList
        * @type Kiwi.Structs.Queue
        * @private
        */
        private _fileList: Kiwi.Files.File [];

        /**
        * 
        * @property _loadList
        * @type Kiwi.Structs.Queue
        * @private
        */
        private _loadList: Kiwi.Files.File [];

        /**
        * 
        * @property _onProgressCallback
        * @private
        */
        private _onProgressCallback;

        /**
        * 
        * @property _onCompleteCallback
        * @private
        */
        private _onCompleteCallback;

        /**
        * If a real byte value calculation will be made prior to the load (much smoother progress bar but costs HEAD calls x total file count)
        * @property _calculateBytes
        * @type Boolean
        * @private
        */
        private _calculateBytes: boolean = true;

        /**
        * Total number of files to be loaded
        * @property _fileTotal
        * @type Number
        * @private
        */
        private _fileTotal: number = 0;

        /**
        * The most recently loaded file (out of the total)
        * @property _currentFile
        * @type Number
        * @private
        */
        private _currentFile: number = 0;

        /**
        * Total file size (in bytes) of all files to be loaded - only set if calculateBytes is true
        * @property _bytesTotal
        * @type Number
        * @private
        */
        private _bytesTotal: number = 0;

        /**
        * Total number of bytes loaded so far (out of _bytesTotal)
        * @property _bytesLoaded
        * @type Number
        * @private
        */
        private _bytesLoaded: number = 0;

        /**
        * Total number of bytes loaded from last completed file
        * @property _bytesCurrent
        * @type Number
        * @private
        */
        private _bytesCurrent: number = 0;
  
        /**
        * When using the tag loader we don't have a byte total, just a X of files total - this holds the percentage each file from that total is worth
        * @property _fileChunk
        * @type Number
        * @private
        */
        private _fileChunk: number = 0;

        /**
        * The total % of the current queue that has been loaded
        * @property _percentLoaded
        * @type Number
        * @private
        */
        private _percentLoaded: number = 0;

        /**
        * Everything in the queue loaded?
        * @property _complete
        * @type Boolean
        * @private
        */
        private _complete: boolean = false;

        //  DOM is ready

        /**
        * 
        * @method boot
        */
        public boot() {

            this._fileList = [];
            this._loadList = [];

        }

        /**
        * 
        * @method init
        * @param {Any} [progress]
        * @param {Any} [complete]
        * @param {Boolean} calculateBytes
        */
        public init(progress: any = null, complete: any = null, calculateBytes: boolean = false) {

            this._fileList.length = 0;
            this._loadList.length = 0;

            this._calculateBytes = calculateBytes;
            this._complete = false;

            if (progress !== null)
            {
                this._onProgressCallback = progress;
            }

            if (complete !== null)
            {
                this._onCompleteCallback = complete;
            }

        }

        /**
        * 
        * @method addImage
        * @param {String} key
        * @param {String} url
        */
        public addImage(key: string, url: string, width?: number, height?: number, offsetX?: number, offsetY?: number, storeAsGlobal: boolean = true) {

            var file: Kiwi.Files.File = new Kiwi.Files.File(this._game, Kiwi.Files.File.IMAGE, url, key, true, storeAsGlobal);
            file.metadata = { width: width, height: height ,offsetX:offsetX,offsetY:offsetY};

            this._fileList.push(file);

        }

        /**
        * 
        * @method addSpriteSheet
        * @param {String} key
        * @param {String} url
        * @param {number} frameWidth
        * @param {number} frameHeight
        
        */
        public addSpriteSheet(key: string, url: string, frameWidth: number, frameHeight: number, numCells?: number, rows?: number, cols?: number, sheetOffsetX?: number, sheetOffsetY?: number, cellOffsetX?: number, cellOffsetY?: number, storeAsGlobal:boolean = true) {

            
            var file = new Kiwi.Files.File(this._game, Kiwi.Files.File.SPRITE_SHEET, url, key,true,storeAsGlobal);
          
            file.metadata = { frameWidth: frameWidth, frameHeight: frameHeight, numCells: numCells, rows: rows, cols: cols, sheetOffsetX: sheetOffsetX, sheetOffsetY: sheetOffsetY, cellOffsetX: cellOffsetX, cellOffsetY: cellOffsetY };
         
            this._fileList.push(file);

        }
        /// ***
        public addTextureAtlas(key: string, imageURL: string, jsonID?: string, jsonURL?: string, storeAsGlobal: boolean = true) {
            
            var imageFile = new Kiwi.Files.File(this._game, Kiwi.Files.File.TEXTURE_ATLAS, imageURL, key, true, storeAsGlobal);
            var jsonFile = new Kiwi.Files.File(this._game, Kiwi.Files.File.JSON, jsonURL, jsonID, true, storeAsGlobal);
            
            
            imageFile.metadata = { jsonID: jsonID };
            jsonFile.metadata = { imageID:key };
            

            this._fileList.push(imageFile,jsonFile);

        }

        /**
        * 
        * @method addAudio
        * @param {String} key
        * @param {String} url
  
        */
        public addAudio(key: string, url: string, storeAsGlobal: boolean = true) {

            this._fileList.push(new Kiwi.Files.File(this._game, Kiwi.Files.File.AUDIO, url, key, true, storeAsGlobal));
           
        }

        /**
        * 
        * @method addJSON
        * @param {String} key
        * @param {String} url
   
        */
        public addJSON(key: string, url: string, storeAsGlobal: boolean = true) {

            this._fileList.push(new Kiwi.Files.File(this._game, Kiwi.Files.File.JSON, url, key, true, storeAsGlobal));

        }

        /**
        * 
        * @method addXML
        * @param {String} key
        * @param {String} url
        */
        public addXML(key: string, url: string, storeAsGlobal: boolean = true) {

            this._fileList.push(new Kiwi.Files.File(this._game, Kiwi.Files.File.XML, url, key, true, storeAsGlobal));

        }

        /**
        * 
        * @method addBinaryFile
        * @param {String} key
        * @param {String} url
        */
        public addBinaryFile(key: string, url: string, storeAsGlobal: boolean = true) {

            this._fileList.push(new Kiwi.Files.File(this._game, Kiwi.Files.File.BINARY_DATA, url, key, true, storeAsGlobal));

        }

        /**
        * 
        * @method addTextFile
        * @param {String} key
        * @param {String} url
        */
        public addTextFile(key: string, url: string, storeAsGlobal: boolean = true) {

            this._fileList.push(new Kiwi.Files.File(this._game, Kiwi.Files.File.TEXT_DATA, url, key, true, storeAsGlobal));

        }

       

        /**
        * 
        * @method startLoad
        */
        public startLoad() {

            if (this._fileList.length === 0)
            {
                this._onCompleteCallback();
            }
            else
            {
                this._onProgressCallback(0, 0, null);

                this._fileTotal = this._fileList.length;
                this._bytesLoaded = 0;
                this._bytesTotal = 0;
                this._bytesCurrent = 0;
                this._currentFile = 0;
                this._fileChunk = 0;
                this._percentLoaded = 0;

                if (this._calculateBytes === true)
                {
                    this.getNextFileSize();
                }
                else
                {
                    this._fileChunk = Math.floor(100 / this._fileTotal);
                    this._loadList = this._fileList;

                    this.nextFile();
                }

            }

        }

        /**
        * 
        * @method getNextFileSize
        */
        private getNextFileSize() {

            if (this._fileList.length === 0)
            {
                var tempFile: Kiwi.Files.File = this._fileList.shift();

                tempFile.getFileDetails((file) => this.addToBytesTotal(file));
            }
            else
            {
                this.nextFile();
            }

        }

        /**
        * 
        * @method addToBytesTotal
        * @param {Kiwi.Files} file
        */
        private addToBytesTotal(file: Kiwi.Files.File) {

            this._bytesTotal += file.fileSize;

            this._loadList.push(file);

            this.getNextFileSize();

        }

        /**
        * 
        * @method nextFile
        */
        private nextFile() {

            this._currentFile++;

            var tempFile: Kiwi.Files.File = this._loadList.shift();

            tempFile.load((f) => this.fileLoadComplete(f), (f) => this.fileLoadProgress(f));

        }

        /**
        * 
        * @method fileLoadProgress
        * @param {Kiwi.Files} file
        */
        private fileLoadProgress(file: Kiwi.Files.File) {

            if (this._calculateBytes === true)
            {
                this._bytesCurrent = file.bytesLoaded;

                if (this._onProgressCallback)
                {
                    //  Send: the percentage complete (overall), the bytes total (overall) and the file currently being loaded
                    this._onProgressCallback(this.getPercentLoaded(), this.getBytesLoaded(), file);
                }
            }

        }

        /**
        * 
        * @method fileLoadComplete
        * @param {Kiwi.Files} file
        */
        private fileLoadComplete(file: Kiwi.Files.File) {

            if (this._calculateBytes === true)
            {
                this._bytesLoaded += file.bytesTotal;
                this._bytesCurrent = 0;

                if (this._onProgressCallback)
                {
                    //  Send: the percentage complete (overall), the bytes total (overall) and the file currently being loaded
                    this._onProgressCallback(this.getPercentLoaded(), this._bytesLoaded, file);
                }
            }
            else
            {
                if (this._onProgressCallback)
                {
                    //  Send: the percentage complete (overall)
                    this._onProgressCallback(this.getPercentLoaded(), 0, file);
                }

            }

        

            if (this._loadList.length === 0)
            {
                //  All files loaded
                this._complete = true;

                
                if (this._onCompleteCallback)
                {
                    this._onCompleteCallback();
                }
            }
            else
            {
                this.nextFile();
            }

        }

        /**
        * 
        * @method getBytesLoaded
        * @return {Number}
        */
        public getBytesLoaded(): number {

            return this._bytesLoaded + this._bytesCurrent;

        }

        /**
        * 
        * @method getPercentLoaded
        * @return {Number}
        */
        public getPercentLoaded(): number {

            if (this._calculateBytes === true)
            {
                return Math.round((this.getBytesLoaded() / this._bytesTotal) * 100);
            }
            else
            {
                return Math.round((this._currentFile / this._fileTotal) * 100);
            }

        }

        /**
        * If true (and xhr/blob is available) the loader will get the bytes total of each file in the queue to give a much more accurate progress report during load
          If false the loader will use the file number as the progress value, i.e. if there are 4 files in the queue progress will get called 4 times (25, 50, 75, 100)
        * @method calculateBytes
        * @param {Boolean} value
        * @return {Boolean}
        */
        public calculateBytes(value?: boolean): boolean {

            if (value)
            {
                this._calculateBytes = value;
            }
            
            return this._calculateBytes;

        }

        /**
        * 
        * @method complete
        * @return {Boolean}
        */
        public complete(): boolean {

            return this._complete;

        }

    }

}
