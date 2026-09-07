'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

// #3A2E22 sat at 1.44:1 against the ink section — the underlines were all but
// invisible until focused. #7A6E5C clears the 3:1 bar for UI boundaries.
const fieldClass =
  'w-full bg-transparent border-b border-[#7A6E5C] focus:border-paper outline-none py-2.5 text-paper placeholder:text-[#9A8E7C] transition-colors';
const labelClass = 'block font-mono text-[11px] tracking-widest uppercase text-[#C9C6BB] mb-2';

const PROJECT_TYPES = [
  'Residential',
  'Commercial',
  'Industrial',
  'Interiors',
  'CRZ approvals',
  'Other / not sure yet',
];

export default function QueryForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('loading');
    setErrorMsg('');

    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      projectType: (form.elements.namedItem('projectType') as HTMLSelectElement).value,
      comments: (form.elements.namedItem('comments') as HTMLTextAreaElement).value,
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong.');
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <p className="font-mono text-sm tracking-wide uppercase text-[#C9C6BB]">
        Thanks — we&apos;ve got your message and will get back to you shortly.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="text-left flex flex-col gap-5">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={fieldClass}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="projectType" className={labelClass}>
          Project type
        </label>
        <select
          id="projectType"
          name="projectType"
          required
          defaultValue=""
          className={`${fieldClass} [&>option]:bg-ink [&>option]:text-paper`}
        >
          <option value="" disabled>
            Select one…
          </option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="comments" className={labelClass}>
          About the site / project
        </label>
        <textarea
          id="comments"
          name="comments"
          required
          rows={4}
          className={`${fieldClass} resize-none`}
        />
      </div>

      {status === 'error' && (
        <p role="alert" className="font-mono text-xs text-accent-light">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="self-start bg-accent hover:bg-accent-dim transition-colors px-7 py-4 font-mono text-[13px] tracking-wide uppercase text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
