import React from "react";

class AppWithStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { appStatus: "loading" };
  }

  handleImageLoaded() {
    this.setState({ appStatus: "loaded" });
  }

  handleImageErrored() {
    this.setState({ appStatus: "failed to load" });
  }

  render() {
    return (
      <div>
        <img
          src={this.props.imageUrl}
          onLoad={this.handleImageLoaded.bind(this)}
          onError={this.handleImageErrored.bind(this)}
        />
        {this.state.appStatus}
      </div>
    );
  }
}


const apps =
[
    {
        "description": "Google",
        "id": "google",
        "url": "https://www.google.com",
        "healthUrl": "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_150x54dp.png"
    },
    {
        "description": "Amazon",
        "id": "amazon",
        "url": "https://www.amazon.com",
        "healthUrl": "http://g-ec2.images-amazon.com/images/G/01/social/api-share/amazon_logo_500500._V323939215_.png"
    },
    {
        "description": "Menora",
        "id": "menora",
        "url": "https://www.menoramivt.co.il",
        "healthUrl": "https://cdn.menoramivt.co.il/public/images/2orkh2ajy8eekfw-website.jpg"
    }
];

function isUp(id) {
document.getElementById(id).className = "up";
}

const appItems = apps.map((apps, idx) =>
<li key={idx} id={apps.id}>
    <div className={apps.appStatus}><a href={apps.url}>{apps.description}</a></div>
    <img className="test"
        src={apps.healthUrl} onLoad={this.isUp.bind(this)} />
</li >
);

ReactDOM.render(
<ul>{appItems}</ul>,
document.getElementById('main')
);


export default ImageWithStatusText;