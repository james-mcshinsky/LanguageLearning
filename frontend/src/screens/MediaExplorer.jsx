import React, { useEffect, useState } from 'react';

// Simple media explorer showing suggested media items and an AI blurb generator.
export default function MediaExplorer() {
  const [mediaItems, setMediaItems] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showCaptions, setShowCaptions] = useState(true);
  const [fontSize, setFontSize] = useState(16);

  // Inputs for suggestion request
  const [queryWord, setQueryWord] = useState('word');
  const [level, setLevel] = useState(1);

  // AI blurb generation state
  const [knownWords, setKnownWords] = useState('');
  const [lPlusWords, setLPlusWords] = useState('');
  const [blurbLength, setBlurbLength] = useState(10);
  const [blurb, setBlurb] = useState('');

  // Fetch media suggestions for a given word/level
  async function fetchMedia() {
    try {
      const res = await fetch(`/media/suggest?word=${encodeURIComponent(queryWord)}&level=${level}`);
      const data = await res.json();
      setMediaItems(Array.isArray(data) ? data : []);
      setCurrent(0);
    } catch (err) {
      console.error('Failed to fetch media', err);
    }
  }

  useEffect(() => {
    fetchMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const item = mediaItems[current];

  function next() {
    setCurrent((idx) => (idx + 1) % mediaItems.length);
  }

  function prev() {
    setCurrent((idx) => (idx - 1 + mediaItems.length) % mediaItems.length);
  }

  async function handleWordClick(word) {
    if (!item) return;
    try {
      await fetch('/media/interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'demo', mediaId: item.id, word }),
      });
    } catch (err) {
      console.error('Failed to record interaction', err);
    }
  }

  async function generateBlurb() {
    const known = knownWords
      .split(',')
      .map((w) => w.trim())
      .filter(Boolean);
    const lplus = lPlusWords
      .split(',')
      .map((w) => w.trim())
      .filter(Boolean);
    try {
      const res = await fetch('/media/blurb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ knownWords: known, lPlusOneWords: lplus, length: blurbLength }),
      });
      const data = await res.json();
      setBlurb(data.blurb || '');
    } catch (err) {
      console.error('Failed to generate blurb', err);
    }
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Media Explorer</h1>

      <div className="space-x-2">
        <input
          className="border p-1"
          value={queryWord}
          onChange={(e) => setQueryWord(e.target.value)}
          placeholder="word"
        />
        <input
          className="border p-1 w-16"
          type="number"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
        />
        <button className="px-2 py-1 bg-accent-primary text-inverse" onClick={fetchMedia}>
          Load
        </button>
      </div>

      {item && (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <button onClick={prev} className="px-2 py-1 bg-secondary">
              Prev
            </button>
            <button onClick={next} className="px-2 py-1 bg-secondary">
              Next
            </button>
            <button
              onClick={() => setShowCaptions((v) => !v)}
              className="px-2 py-1 bg-secondary"
            >
              {showCaptions ? 'Hide Captions' : 'Show Captions'}
            </button>
            <button
              onClick={() => setFontSize((s) => Math.max(8, s - 2))}
              className="px-2 py-1 bg-secondary"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize((s) => s + 2)}
              className="px-2 py-1 bg-secondary"
            >
              A+
            </button>
          </div>

          {item.video && (
            <video controls className="w-full max-w-md" src={item.video} />
          )}
          {item.audio && (
            <audio controls className="w-full" src={item.audio} />
          )}

          {showCaptions && item.transcript && (
            <div style={{ fontSize: `${fontSize}px` }} className="mt-2">
              {item.transcript.split(/\s+/).map((w, i) => (
                <span
                  key={i}
                  onClick={() => handleWordClick(w)}
                  className="cursor-pointer hover:underline"
                >
                  {w}{' '}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold">AI Blurb Generator</h2>
        <div className="space-y-2">
          <input
            className="border p-1 w-full"
            placeholder="Known words (comma separated)"
            value={knownWords}
            onChange={(e) => setKnownWords(e.target.value)}
          />
          <input
            className="border p-1 w-full"
            placeholder="L+1 words (comma separated)"
            value={lPlusWords}
            onChange={(e) => setLPlusWords(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="1"
              max="50"
              value={blurbLength}
              onChange={(e) => setBlurbLength(Number(e.target.value))}
            />
            <span>{blurbLength} words</span>
          </div>
          <button
            className="px-2 py-1 bg-accent-primary text-inverse"
            onClick={generateBlurb}
          >
            Generate
          </button>
          {blurb && <p className="mt-2">{blurb}</p>}
        </div>
      </div>
    </div>
  );
}

