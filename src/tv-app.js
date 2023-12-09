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
        display: grid; 

      }

      .container {
        display: grid;
        grid-template-columns: repeat(2, 860px);
      }

      .container .tvandinfo {
        grid-column: 1;
        margin-top: 30px;
        width: 854px;
        height: 480px;
      }

      .container .guide { 
        grid-column: 2;
        width: 300px;
        font-size: .94rem;
        margin-top: 90px;
        padding-left: 10px;
        text-align: center;
        -webkit-overflow-scrolling: touch;
        overflow-y: auto;
        height: 77.5vh;
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
            <video-player source="https://www.youtube.com/watch?v=6mexBBaLkZ0" accent-color="blue" dark track="https://haxtheweb.org/files/HAXshort.vtt"></video-player>
            <tv-channel title="Cnext Top 10 Movies of 2023" presenter="Cnext.com">
              All the best Films that made the top tens list of 2023
            </tv-channel>
        </div>

        <div class="guide"> 
         ${
            this.listings.map(
              (item, index) => html`
                  <tv-channel 
                  title="${item.title}"
                  description="${item.description}"
                  presenter="${item.metadata.author}"
                  @click="${this.itemClick}"
                  timecode= "${item.metadata.timecode}">
                  
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
    // this will give you the current time so that you can progress what's active based on it playing
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector("a11y-media-player").media.currentTime
    // this forces the video to play
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play()
    // this forces the video to jump to this point in the video via SECONDS
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').seek(e.target.timecode)

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
