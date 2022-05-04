/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2022, United States Government
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
import indicatorTemplate from './res/indicator-template.html';

const DEFAULT_ICON_CLASS = 'icon-info';

class SimpleIndicator extends EventEmitter {
    constructor(openmct) {
        super();

        this.openmct = openmct;
        this.element = compileTemplate(indicatorTemplate)[0];
        this.priority = openmct.priority.DEFAULT;

        this.textElement = this.element.querySelector('.js-indicator-text');

        //Set defaults
        this.text('New Indicator');
        this.description('');
        this.iconClass(DEFAULT_ICON_CLASS);
        this.statusClass('');

        this.click = this.click.bind(this);

        this.element.addEventListener('click', this.click);
        openmct.once('destroy', () => {
            this.removeAllListeners();
            this.element.removeEventListener('click', this.click);
        });
    }

    text(text) {
        if (text !== undefined && text !== this.textValue) {
            this.textValue = text;
            this.textElement.innerText = text;

            if (!text) {
                this.element.classList.add('hidden');
            } else {
                this.element.classList.remove('hidden');
            }
        }

        return this.textValue;
    }

    description(description) {
        if (description !== undefined && description !== this.descriptionValue) {
            this.descriptionValue = description;
            this.element.title = description;
        }

        return this.descriptionValue;
    }

    iconClass(iconClass) {
        if (iconClass !== undefined && iconClass !== this.iconClassValue) {
            // element.classList is precious and throws errors if you try and add
            // or remove empty strings
            if (this.iconClassValue) {
                this.element.classList.remove(this.iconClassValue);
            }

            if (iconClass) {
                this.element.classList.add(iconClass);
            }

            this.iconClassValue = iconClass;
        }

        return this.iconClassValue;
    }

    statusClass(statusClass) {
        if (statusClass !== undefined && statusClass !== this.statusClassValue) {
            if (this.statusClassValue) {
                this.element.classList.remove(this.statusClassValue);
            }

            if (statusClass) {
                this.element.classList.add(statusClass);
            }

            this.statusClassValue = statusClass;
        }

        return this.statusClassValue;
    }

    click(event) {
        this.emit('click', event);
    }

    getElement() {
        return this.element;
    }
}

function compileTemplate(htmlTemplate) {
    const templateNode = document.createElement('template');
    templateNode.innerHTML = htmlTemplate;

    return templateNode.content.cloneNode(true).children;
}

export default SimpleIndicator;
