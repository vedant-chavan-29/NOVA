import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { phraseDictionary } from '../../translations';

// Universal DOM Auto-Translator:
// Dynamically converts all text nodes across the entire application into the selected language (en, mr, hi).
export const UniversalTranslator = () => {
  const { lang } = useApp();
  const isTranslatingRef = useRef(false);

  useEffect(() => {
    // Sort phrases by descending length so compound phrases match before single words
    const sortedPhrases = [...phraseDictionary].sort((a, b) => {
      const maxA = Math.max(a.en.length, a.mr.length, a.hi.length);
      const maxB = Math.max(b.en.length, b.mr.length, b.hi.length);
      return maxB - maxA;
    });

    const translateText = (text, targetLang) => {
      if (!text || typeof text !== 'string') return text;
      let result = text;

      for (const item of sortedPhrases) {
        const targetValue = item[targetLang];
        if (!targetValue) continue;

        // Check each source language
        for (const sourceLang of ['en', 'mr', 'hi']) {
          if (sourceLang === targetLang) continue;
          const sourceValue = item[sourceLang];
          if (!sourceValue) continue;

          // If exact match
          if (result.trim() === sourceValue) {
            result = result.replace(sourceValue, targetValue);
            break;
          }

          // If contains phrase
          if (result.includes(sourceValue)) {
            // Global replace of the exact phrase
            result = result.split(sourceValue).join(targetValue);
          }
        }
      }

      return result;
    };

    const translateDOM = (rootNode = document.body) => {
      if (isTranslatingRef.current || !rootNode) return;
      isTranslatingRef.current = true;

      try {
        const walker = document.createTreeWalker(
          rootNode,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              if (!node.nodeValue || !node.nodeValue.trim()) {
                return NodeFilter.FILTER_REJECT;
              }
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;
              const tag = parent.tagName.toUpperCase();
              if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'CODE') {
                return NodeFilter.FILTER_REJECT;
              }
              // Skip raw numbers/currencies only
              if (/^[0-9\s₹$%&.,:;+\-*\/#()]+$/.test(node.nodeValue)) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
          }
        );

        const nodesToTranslate = [];
        let currentNode;
        while ((currentNode = walker.nextNode())) {
          nodesToTranslate.push(currentNode);
        }

        for (const node of nodesToTranslate) {
          const original = node.nodeValue;
          const translated = translateText(original, lang);
          if (translated !== original) {
            node.nodeValue = translated;
          }
        }

        // Also translate input placeholders
        const inputs = rootNode.querySelectorAll('input[placeholder], textarea[placeholder]');
        inputs.forEach(input => {
          const originalPlaceholder = input.getAttribute('placeholder');
          if (originalPlaceholder) {
            const translated = translateText(originalPlaceholder, lang);
            if (translated !== originalPlaceholder) {
              input.setAttribute('placeholder', translated);
            }
          }
        });
      } catch (err) {
        console.error("Auto-translator error:", err);
      } finally {
        isTranslatingRef.current = false;
      }
    };

    // Run immediately on lang change
    translateDOM();

    // Observe DOM mutations to catch newly rendered components (tabs, modals, cards)
    let debounceTimer = null;
    const observer = new MutationObserver((mutations) => {
      if (isTranslatingRef.current) return;
      
      let shouldTranslate = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldTranslate = true;
          break;
        }
      }

      if (shouldTranslate) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          translateDOM();
        }, 60);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [lang]);

  return null;
};
