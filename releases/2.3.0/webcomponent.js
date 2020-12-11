(function () {
    let version = "2.3.0";
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `<link rel="stylesheet" type="text/css" href="http://widgets.nkappler.de/datepicker/releases/2.3.0/light.css"/>`;

    class DatePicker extends HTMLElement {
        constructor() {
            super();
            this.init();
            this.checkForUpdates();
        }
        
        async checkForUpdates() {
            try {
                const contribution = await (await fetch("http://widgets.nkappler.de/datepicker/releases/latest/datepicker.json")).json();
                if (contribution.version > version) {
                    console.log("A newer version of the Datepicker Custom Widget is available. Please contact your system administrator");
                }
            } catch (error) { }
        }

        init() {
            if (this.children.length === 2) return; //constructor called during drag+drop
            if (!this.querySelector("link")) {
                this.appendChild(tmpl.content.cloneNode(true));
            }
            var ctor = sap.m.DatePicker;
            if (this._enablerange) { ctor = sap.m.DateRangeSelection; }
            this.DP = new ctor({
                change: function () {
                    this.fireChanged();
                    this.dispatchEvent(new Event("onChange"));
                }.bind(this)
            }).addStyleClass("datePicker");
            this.DP.placeAt(this);
        }

        fireChanged() {
            var properties = { dateVal: this.DP.getDateValue() };
            if (this._enablerange) { properties.secondDateVal = this.DP.getSecondDateValue(); }
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: properties
                }
            }));
        }

        set dateVal(value) {
            if (value == undefined || !this.DP) return;
            if (typeof (value) === "string") value = new Date(value);
            this.DP.setDateValue(value);
        }

        set secondDateVal(value) {
            if (value == undefined || !this.DP || !this._enablerange) return;
            if (typeof (value) === "string") value = new Date(value);
            this.DP.setSecondDateValue(value);
        }

        set format(value) {
            if (!this.DP) return;
            this.DP.setDisplayFormat(value);
        }

        set darktheme(value) {
            this.querySelector("link").setAttribute("href", "http://widgets.nkappler.de/datepicker/releases/2.3.0/" +
                (value ? "dark.css" : "light.css")
            );
        }

        set enablerange(value) {
            if (value == undefined || !this.DP) return;
            this._enablerange = value;
            this.DP.destroy();
            this.init();
        }
    }

    customElements.define('nkappler-date-picker', DatePicker);
})();
