// import stuff
import { LitElement, html, css } from 'lit';

export class TvChannel extends LitElement {
  // defaults
  constructor() {
    super();
    this.title = '';
    this.timecode = 0;
    this.presenter = '';
    this.description = '';
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-channel';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      presenter: { type: String },
      timecode: { type: Number },
      thumbnail: {type: String},
      active: {type: Boolean, reflect: true},
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`

      .thumbnail {
        max-width: 100%;
        height: auto;
        margin-bottom: 10px;
        object-fit: cover;
      }

      :host([active]) {
        background-color: #007bff;
      }


      .wrapper {
        padding: 5px;
        background-color: #eeeeee;
        margin-top: 12px;
      }

      .wrapper h3 { 
        align-items: left; 
      }
    `;
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <div class="wrapper">
      <img class="thumbnail" src="${this.thumbnail}">
        <h3>${this.title}</h3>
        <h3>${this.description}</h3>
        <slot></slot>
      </div>  
      `;
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);
