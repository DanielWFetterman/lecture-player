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
    this.activeIndex = 0;
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
      activeIndex: { type: Number }
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
        width: 350px;
        font-size: .94rem;
        margin-top: 90px;
        padding-left: 10px;
        text-align: center;
        -webkit-overflow-scrolling: touch;
        overflow-y: auto;
        height: 77.5vh;
      }

      .buttons {
        grid-column: 1;
        grid-row: 2;
        padding-top: 65px;
      }

      .container .buttons .prev-btn{
        width: 125px;
        height: 70px; 
        margin-top: 10px;
        margin-right: 300px;
        font-size: 20px;
      }

      .container .buttons .next-btn{
        width: 125px;
        height: 70px;
        margin-left: 300px;
        font-size: 20px;
      }

      .thumbnail {
          max-width: 100%;
          height: auto;
        }

      .description-box {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-top: 20px;
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
          <h2>Cnext Top 10 Movies of 2023 </h2>
            <!-- <tv-channel title="Cnext Top 10 Movies of 2023" presenter="Cnext.com">
              All the best Films that made the top tens list of 2023
            </tv-channel> -->
          <div class="description-box">

            ${this.listings.length > 0 ? this.listings[this.activeIndex].description : ''}

          </div>
        </div>

          <div class="buttons">
            <button class="prev-btn" @click="${this.prev}"> Previous </button>
            <button class="next-btn" @click="${this.next}"> Next </button>
           </div>
        <div class="guide"> 
         ${this.listings.map((item, index) => html`
                <tv-channel
                  ?active="${index === this.activeIndex}"
                  index="${index}"
                  @click="${this.itemClick}"
                  title="${item.title}"
                  presenter="${item.metadata.author}"
                  timecode="${item.metadata.timecode}"
                  thumbnail="${item.metadata.thumbnail}">
                  
                </tv-channel> `)}
          </div>
    </div>
    `;
  }


  itemClick(e) {
    
    console.log(e.target);
    this.activeIndex = e.target.index;
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play();

  }

  // LitElement life cycle for when any property changes
  updated(changedProperties) {

    super.updated(changedProperties);

    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateListings(this[propName]);
      }

      if(propName === "activeIndex") {
        console.log(this.shadowRoot.querySelectorAll("tv-channel"));
        console.log(this.activeIndex)

        var activeChannel = this.shadowRoot.querySelector("tv-channel[index = '" + this.activeIndex + "' ] ");
       
        console.log(activeChannel);
        this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').seek(activeChannel.timecode);
      }

    });
  }

  prev() {
    this.activeIndex = Math.max(0, this.activeIndex - 1);
    
  }

  next() {
    this.activeIndex = Math.min(this.listings.length - 1, this.activeIndex + 1);  

  }

  connectedCallback() {
    super.connectedCallback();

    setInterval(() => { 
      const currentTime = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').media.currentTime; 
      if(this.activeIndex + 1 < this.listings.length && 
          currentTime >= this.listings[this.activeIndex + 1].metadata.timecode) { 
        this.activeIndex++;
      }
    }, 1000); 

  }

  async updateListings(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
      }
    });
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
