// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "./tv-channel.js";
import "@lrnwebcomponents/video-player/video-player.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {

      }

      .conatiner {
        display: grid;
        grid-template-columns: repeat(2, 500px);
        grid-template-rows: auto;
        gap: 25px;
      }

      .container .tvandinfo {
        display: grid;
        grid-template-columns: repeat(1, 600px);
        grid-template-rows: repeat(2, px); 
        gap: 25px;
        grid-column: 1; 
        grid-row: 1;
      }

      .container .guide { 
        display: grid; 
        grid-template-columns: repeat(1, 700px);
        grid-template-rows: repeat(2, 250px);
        grid-column: 2;
        grid-row: 2;

      }
      
      tv-channel {
        grid-column: 2; 
        grid-row-start: auto;
      }

      video-player {
        width: 640px; 
        height: 360px;
        grid-column: 1;
        grid-row: 2;
        margin: 16px;
        padding: 16px;
      }

      h2 {
        grid-column: 1; 
        grid-row: 1; 
        padding-left: 32px; 
 
      }

      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
       <!-- video -->
       <div class="container"> 
          <div class="tvandinfo"> 
            <h2>${this.name}</h2>
            <video-player source="https://www.youtube.com/watch?v=LrS7dqokTLE" accent-color="blue" dark track="https://haxtheweb.org/files/HAXshort.vtt">
            </video-player>
          </div>  

        <div class="guide"> 
            ${
            this.listings.map(
              (item) => html`
                  <tv-channel 
                  title="${item.title}"
                  presenter="${item.metadata.author}"
                  @click="${this.itemClick}">
                </tv-channel>
          `
            )
            }
          </div>

      <div>
        <!-- discord / chat - optional -->
      </div>

      <!-- dialog -->
      <!-- <sl-dialog label="Dialog" class="dialog">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <sl-button slot="footer" variant="primary" @click="${this.closeDialog}">Close</sl-button>
      </sl-dialog> -->
    </div>
    `;
  }

  // closeDialog(e) {
  //   const dialog = this.shadowRoot.querySelector('.dialog');
  //   dialog.hide();
  // }

  itemClick(e) {
    console.log(e.target);
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.show();
  }

  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }

  async updateSourceData(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
      }
    });
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
