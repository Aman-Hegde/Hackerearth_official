import { TypingAnime } from "./TypingAnime";
import logo from '../assets/image.png'

function RightPanelLogin(){
    return(
        <div className="hidden md:flex w-0 md:w-1/2 flex-col items-center justify-center relative overflow-hidden p-8 
    bg-gradient-to-br from-indigo-50 to-blue-200 dark:from-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Floating Bubbles or any SVG/Lottie effect */}
          <svg className="opacity-30 w-full h-full" style={{ position: 'absolute', left: 0, top: 0 }} xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 15 }).map((_, i) =>
              <circle
                key={i}
                cx={Math.random() * 600}
                cy={Math.random() * 800}
                r={Math.random() * 40 + 20}
                fill={i % 3 === 0 ?
                  "#6366F1" : i % 3 === 1 ? "#818CF8" : "#E0E7FF"}
                opacity={Math.random() * 0.4 + 0.2}
              />
            )}
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <img src={logo} alt="HackerEarth Logo" width={100} height={100}
            className="w-24 h-20 rounded-xl object-contain mb-6 drop-shadow-xl" />
          <h1 className="text-5xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white text-center">
            <TypingAnime text="HackerEarth" speed={80} className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent" />
          </h1>
          <p className="text-2xl text-slate-700 dark:text-slate-200 font-medium mb-8 text-center">NMAMIT Tech Club</p>
          <div className="flex flex-col items-center gap-4">
            {/* Weekly Coding Contests */}
            <div className="inline-flex items-center space-x-2 px-6 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 text-lg shadow font-semibold transition">
              {/* Use a Timer or Calendar icon */}
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10m-7 5h2m8-5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>
              <span>Weekly Coding Contests</span>
            </div>
            {/* Aptitude & Reasoning */}
            <div className="inline-flex items-center space-x-2 px-6 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 text-lg shadow font-semibold transition">
              {/* Use a Brain or Activity icon */}
              <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M16 7c0-.6.4-1 1-1s1 .4 1 1v10c0 .6-.4 1-1 1s-1-.4-1-1V7Zm-9 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM5.6 15.6a2 2 0 1 1 1.8 3.6A5.97 5.97 0 0 1 3 18c0-1.2.5-2.3 1.6-2.4ZM18 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM16 19.6A2 2 0 1 1 18 14a2 2 0 0 1-2 5.6ZM12 5a5 5 0 0 0-5 5v8a5 5 0 0 0 10 0v-8a5 5 0 0 0-5-5Z"></path></svg>
              <span>Aptitude & Reasoning Tests</span>
            </div>
            {/* Developer Roadmaps */}
            <div className="inline-flex items-center space-x-2 px-6 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 text-lg shadow font-semibold transition">
              {/* Use a Map or Compass icon */}
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="m16.24 7.76-1.41 2.83-2.83 1.41 1.41-2.83 2.83-1.41ZM12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10Z"></path></svg>
              <span>Guided Roadmaps</span>
            </div>
          </div>
        </div>
      </div>
    );
}

export default RightPanelLogin;