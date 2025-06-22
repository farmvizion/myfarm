const TwitchIframeEmbed = () => {
    const parent = window.location.hostname;

    return (
        <iframe
            src={`https://player.twitch.tv/?channel=farmvizion&parent=${parent}&autoplay=false`}
            height="100%"
            width="100%"
            frameBorder="0"
            scrolling="no"
            allowFullScreen={true}
            allow="autoplay; fullscreen"
            title="Twitch Stream"
        />
    );
};

export default TwitchIframeEmbed;