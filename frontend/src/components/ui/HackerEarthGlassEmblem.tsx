import logo from '../../assets/image.png';

const HackerEarthGlassEmblem = () => (
  <figure className="he-emblem-shell">
    <div className="he-emblem">
      <span className="he-emblem__ring he-emblem__ring--outer" aria-hidden="true" />
      <span className="he-emblem__ring he-emblem__ring--middle" aria-hidden="true" />
      <span className="he-emblem__ring he-emblem__ring--inner" aria-hidden="true" />
      <span className="he-emblem__reflection" aria-hidden="true" />
      <span className="he-emblem__accent he-emblem__accent--one" aria-hidden="true" />
      <span className="he-emblem__accent he-emblem__accent--two" aria-hidden="true" />

      <div className="he-emblem__core">
        <div className="he-emblem__logo-wrap">
          <img
            src={logo}
            alt="HackerEarth Hub-NMAMIT club logo"
            className="he-emblem__logo"
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="he-emblem__caption" aria-hidden="true">
          <span>HackerEarth Hub</span>
          <span className="he-emblem__divider" aria-hidden="true" />
          <span>NMAMIT</span>
        </div>
      </div>
    </div>
    <figcaption className="sr-only">HackerEarth Hub-NMAMIT</figcaption>
  </figure>
);

export default HackerEarthGlassEmblem;
