import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useLanguageStore } from '../store/useLanguageStore';

describe('useLanguageStore', () => {
    it('should initialize with default values', () => {
        const { result } = renderHook(() => useLanguageStore());
        expect(result.current.selected).toBe('en');
        expect(result.current.translations).toEqual({});
    });

    it('should update selected language', () => {
        const { result } = renderHook(() => useLanguageStore());

        act(() => {
            result.current.setLanguage('es');
        });

        expect(result.current.selected).toBe('es');
    });

    it('should add a translation', () => {
        const { result } = renderHook(() => useLanguageStore());

        act(() => {
            result.current.setTranslation('msg1', 'Hola');
        });

        expect(result.current.translations).toEqual({ msg1: 'Hola' });
    });
});
