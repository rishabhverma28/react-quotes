import React, { Component } from "react";
// import FontPicker from "font-picker-react";
import html2canvas from "html2canvas";
import { saveAs } from 'file-saver';

class App extends Component {
    constructor(props) {
        super(props);
        // this.textInput = React.createRef();
        this.state = {
            quote: "Interesting things never happen to me. I happen to them.",
            author: "Bernard Shaw",
            quoteImage: "",
            activeFont: "Abel",
            borderColor: "#e66465",
            opacity: 0.4,
            textColor: "#000000",
            ownQuote: "",
            ownQuoteChecked: false,
            selfAuthored: "",
            ownImage: false,
            imageURLIncorrect: false
        };
        this.colorChange = this.colorChange.bind(this);
        this.opacityChange = this.opacityChange.bind(this);
        this.textColorChange = this.textColorChange.bind(this);
        this.getBackground = this.getBackground.bind(this);
        this.getQuote = this.getQuote.bind(this);
        this.checkChange = this.checkChange.bind(this);
        this.ownQuote = this.ownQuote.bind(this);
        this.ownAuthor = this.ownAuthor.bind(this);
        this.saveAsImg = this.saveAsImg.bind(this);
        this.imageChange = this.imageChange.bind(this);
        this.imageInput = React.createRef();
        this.handleAbsentImage = this.handleAbsentImage.bind(this);
    }
    getBackground(link) {
        // debugger
        let linkToUnsplash = "";
        if (link === undefined) {
            linkToUnsplash = "https://source.unsplash.com/collection/143203/";
        } else {
            linkToUnsplash = link;
        }
        fetch(linkToUnsplash)
            .then(response => {
                // console.log(response);
                this.setState({
                    quoteImage: response.url,
                    imageURLIncorrect: false
                });
            })
            .catch(err => {
                // debugger;
                this.setState({
                    imageURLIncorrect: true
                });
            });
    }
    getQuote() {
        fetch(
            "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=",
            { cache: "no-store" }
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error("Bad response");
                }
                return response.json();
            })
            .then(data => {
                // debugger;
                // console.log(data);
                let quotes = data[0].content
                    .replace("<p>", "")
                    .replace("</p>", "");
                this.setState({
                    quote: quotes,
                    author: data[0].title
                });
            })
            .catch(error => console.log("failed to fetch", error));
    }
    componentDidMount() {
        this.getQuote();
        this.getBackground();
        // console.log(this.state)
    }
    colorChange(e) {
        this.setState({
            borderColor: e.target.value
        });
        // console.log(e.target.value);
    }
    opacityChange(e) {
        this.setState({
            opacity: e.target.value
        });
        // console.log(e.target.value);
    }
    textColorChange(e) {
        this.setState({
            textColor: e.target.value
        });
    }
    ownQuote(e) {
        this.setState({
            ownQuote: e.target.value
        });
    }

    ownAuthor(e) {
        this.setState({
            selfAuthored: e.target.value
        });
    }
    checkChange(e) {
        // debugger;
        // console.log(e.target.name);
        if (e.target.checked) {
            if (e.target.name === "check-own") {
                this.setState({
                    ownQuoteChecked: true
                });
            } else {
                this.setState({
                    ownImage: true
                });
            }
        } else {
            if (e.target.name === "check-own") {
                this.setState({
                    ownQuoteChecked: false
                });
            } else {
                this.setState({
                    ownImage: false
                });
            }
        }
    }
    imageChange(e) {
        e.preventDefault();
        // this.setState({
        //     this
        // })
        this.getBackground(this.imageInput.current.value);
    }
    saveAsImg() {
        // const inp = document.getElementById("quotes-container")
        // domtoimage.toPng(inp).then(function (dataUrl){
        //     var img = new Image()
        //     img.src = dataUrl
        //     document.body.appendChild(img);
        // })
        // .catch(function (error) {
        //     console.error('oops, something went wrong!', error);
        // });
        html2canvas(document.getElementById("quotes-container"), {
            useCORS: true
        }).then(function(canvas) {
            // console.log(canvas)
            let imgData = canvas.toDataURL('image/png');
            saveAs(imgData, "Image.png"); 
        });
    }
    handleAbsentImage() {
        // debugger;
        this.setState({
            imageURLIncorrect: true
        });
        this.getBackground();
    }
    render() {
        const styles = {
            borderColor: this.state.borderColor,
            // opacity: this.state.opacity,
            color: this.state.textColor
        };

        return (
            // <div>
            //     <p>What a world.</p>
            //     <Button>Hey</Button>
            <div className="container">
                <div
                    className="quotes-container apply-font"
                    id="quotes-container"
                    style={styles}
                >
                    <img
                        src={this.state.quoteImage}
                        className="quotes-image"
                        style={{ opacity: this.state.opacity }}
                        onError={this.handleAbsentImage}
                        alt = "Quote"
                    />
                    <div className="quotes-full">
                        {this.state.ownQuoteChecked ? (
                            <div className="quotes-text">
                                {this.state.ownQuote}
                            </div>
                        ) : (
                            <div
                                className="quotes-text"
                                dangerouslySetInnerHTML={{
                                    __html: this.state.quote
                                }}
                            />
                        )
                        // <div className="quotes-author">{this.state.author}</div>
                        }
                        <div className="quotes-author">
                            {this.state.ownQuoteChecked
                                ? this.state.selfAuthored
                                : this.state.author}
                        </div>
                    </div>
                </div>
                {/* {this.state.ownQuoteChecked && <span>{this.state.ownQuote}</span>} */}
                <div className="controls">
                    <label htmlFor="borderColor">Border Color</label>
                    <input
                        type="color"
                        id="borderColor"
                        name="borderColor"
                        value={this.state.borderColor}
                        onChange={this.colorChange}
                    />

                    <label htmlFor="opacity">Opacity</label>
                    <input
                        type="range"
                        id="opacity"
                        name="opacity"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={this.state.opacity}
                        onChange={this.opacityChange}
                    />

                    <label htmlFor="textColor">Text Color</label>
                    <input
                        type="color"
                        id="textColor"
                        name="textColor"
                        value={this.state.textColor}
                        onChange={this.textColorChange}
                    />

                    <button
                        onClick={this.getQuote}
                        className="button-style get-quote"
                    >
                        Get Another Quote
                    </button>
                    <button
                        onClick={this.getBackground}
                        className="button-style get-background"
                    >
                        Get Another Background Image
                    </button>
                    {/* <FontPicker
                        apiKey="AIzaSyDPVlevuL5i46RR4rfrk26B-hPVDuSOam0"
                        activeFont={this.state.activeFont}
                        className="font-picker"
                        onChange={nextFont =>
                            this.setState({ activeFont: nextFont.family })
                        }
                    /> */}
                    <label htmlFor="check-own">Customize the quote?</label>
                    <input
                        type="checkbox"
                        name="check-own"
                        id="check-own"
                        defaultChecked={false}
                        onChange={this.checkChange}
                    />
                    {this.state.ownQuoteChecked && (
                        <div className="own-quote">
                            <label htmlFor="ownQuote">
                                Enter your own Quote
                            </label>
                            <textarea
                                // type="textarea"
                                // id="ownQuote"
                                // name="ownQuote"
                                value={this.state.ownQuote}
                                onChange={this.ownQuote}
                            />
                            <label htmlFor="ownQuote">
                                Enter the Author's Name:
                            </label>
                            <input
                                type="text"
                                id="ownAuthor"
                                name="ownAuthor"
                                onChange={this.ownAuthor}
                            />
                        </div>
                    )}
                    {/* <button onClick = {this.typeQuote} className ="type-quote">Get Another Quote</button> */}
                    <label htmlFor="check-image">Customize the Image?</label>
                    <input
                        type="checkbox"
                        name="check-image"
                        id="check-image"
                        defaultChecked={false}
                        onChange={this.checkChange}
                    />
                    {this.state.ownImage && (
                        <div className="own-quote">
                            <label htmlFor="image-change">
                                Enter the image URL
                            </label>
                            <input
                                type="text"
                                id="image-change"
                                name="image-change"
                                ref={this.imageInput}
                                // value={this.state.imageChange}
                                // onChange={this.imageChange}
                            />
                            <button
                                onClick={this.imageChange}
                                className="button-style image-change"
                            >
                                Add Image to the quote
                            </button>
                            {this.state.imageURLIncorrect && (
                                <div className="image-fetch-error">
                                    The image URL that you entered was
                                    incorrect. Please try again.
                                </div>
                            )}
                        </div>
                    )}
                    <button
                        onClick={this.saveAsImg}
                        className="button-style save-as-img"
                    >
                        Save as an Image
                    </button>
                </div>
            </div>
        );
    }
}

export default App;
