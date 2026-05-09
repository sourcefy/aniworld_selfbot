module.exports = {
    aniworld: {
        name: 'AniWorld', icon: '🌍', baseUrl: 'https://aniworld.to', searchPath: '/anime-filme?q=',
        languages:  { ger_sub: 'Deutsch Sub', ger_dub: 'Deutsch Dub', eng_sub: 'Englisch Sub', jap_sub: 'Japanisch Sub' },
        hosters:    ['VOE', 'Vidoza', 'Streamtape'], 
        episodePath: (base, s, e) => `${base}/staffel-${s}/episode-${e}`,
    },
    aniflix: {
        name: 'Aniflix', icon: '🎬', baseUrl: 'https://aniflix.uno', searchPath: '/search?q=',
        languages:  { ger_sub: 'Deutsch Sub', ger_dub: 'Deutsch Dub', eng_sub: 'Englisch Sub', eng_dub: 'Englisch Dub' },
        hosters:    ['VOE', 'StreamSB', 'Streamtape'], 
        episodePath: (base, s, e) => `${base}/staffel-${s}/episode-${e}`,
    },
};