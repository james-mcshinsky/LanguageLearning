import React, { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

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
    <div className="p-s space-y-m">
      <h1 className="text-2xl font-bold">Media Explorer</h1>

      <div className="space-x-xs">
        <Input
          value={queryWord}
          onChange={(e) => setQueryWord(e.target.value)}
          placeholder="you"
        />
        <Input
          className="w-16"
          type="number"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
        />
        <Button onClick={fetchMedia}>Load</Button>
      </div>

      {item && (
        <Card className="space-y-xs">
          <div className="flex space-x-xs">
            <Button onClick={prev} variant="secondary">
              Prev
            </Button>
            <Button onClick={next} variant="secondary">
              Next
            </Button>
            <Button onClick={() => setShowCaptions((v) => !v)} variant="secondary">
              {showCaptions ? 'Hide Captions' : 'Show Captions'}
            </Button>
            <Button onClick={() => setFontSize((s) => Math.max(8, s - 2))} variant="secondary">
              A-
            </Button>
            <Button onClick={() => setFontSize((s) => s + 2)} variant="secondary">
              A+
            </Button>
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
                <React.Fragment key={i}>
                  <button
                    type="button"
                    onClick={() => handleWordClick(w)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleWordClick(w);
                      }
                    }}
                    className="inline bg-transparent p-0 m-0 border-0 cursor-pointer hover:underline focus:underline focus:outline-none"
                  >
                    {w}
                  </button>{' '}
                </React.Fragment>
              ))}
            </div>
          )}
        </Card>
      )}

      <div className="mt-m">
        <h2 className="text-xl font-semibold">AI Blurb Generator</h2>
        <Card className="space-y-xs mt-xs">
          <Input
            className="w-full"
            placeholder="Known words (comma separated)"
            value={knownWords}
            onChange={(e) => setKnownWords(e.target.value)}
          />
          <Input
            className="w-full"
            placeholder="L+1 words (comma separated)"
            value={lPlusWords}
            onChange={(e) => setLPlusWords(e.target.value)}
          />
          <div className="flex items-center space-x-xs">
            <Input
              type="range"
              min="1"
              max="50"
              value={blurbLength}
              onChange={(e) => setBlurbLength(Number(e.target.value))}
            />
            <span>{blurbLength} words</span>
          </div>
          <Button onClick={generateBlurb}>Generate</Button>
          {blurb && <p className="mt-xs">{blurb}</p>}
        </Card>
      </div>
    </div>
  );
}

