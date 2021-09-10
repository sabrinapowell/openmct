/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2021, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

import EventEmitter from 'EventEmitter';

export default class StatusAPI extends EventEmitter {
    constructor(openmct) {
        super();

        this._openmct = openmct;
        this._statusCache = {};

        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
        this.observe = this.observe.bind(this);

        openmct.once('destroy', () => {
            this.removeAllListeners();
        });
    }

    get(identifier) {
        let keyString = this._openmct.objects.makeKeyString(identifier);

        return this._statusCache[keyString];
    }

    set(identifier, value) {
        let keyString = this._openmct.objects.makeKeyString(identifier);

        this._statusCache[keyString] = value;
        this.emit(keyString, value);
    }

    delete(identifier) {
        let keyString = this._openmct.objects.makeKeyString(identifier);

        this._statusCache[keyString] = undefined;
        this.emit(keyString, undefined);
        delete this._statusCache[keyString];
    }

    observe(identifier, callback) {
        let key = this._openmct.objects.makeKeyString(identifier);

        this.on(key, callback);

        return () => {
            this.off(key, callback);
        };
    }
}
