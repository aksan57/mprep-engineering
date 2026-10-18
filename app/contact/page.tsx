import QuoteForm from '@/components/QuoteForm';
import { CONTACT } from '@/data/site';
import { pageMeta } from '@/lib/meta';
import s from './contact.module.css';

export const metadata = pageMeta('/contact/', { title: 'Request a quote' });

export default function ContactPage() {
  return (
    <section className="section section--navy">
      <div className={s.grid}>
        <div className={s.intro}>
          <h1 className="h2">Request a quote</h1>
          <p className={s.lead}>Tell us about the equipment you need to design or the engineering problem you need to evaluate. Share your project requirements, available drawings or technical data, and target timeline.</p>
          <p className={s.sub}>We will review your inquiry, clarify the project scope where necessary, and prepare a tailored proposal based on the requirements.</p>
          <div className={s.direct}>
            <h2 className={s.directLabel}>DIRECT CONTACT</h2>
            <dl className={s.dl}>
              <div><dt>EMAIL</dt><dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
              <div><dt>LINKEDIN</dt><dd><a href={CONTACT.linkedinCompany} target="_blank" rel="noopener">MPrep Engineering</a></dd></div>
              <div><dt>FOUNDER</dt><dd><a href={CONTACT.linkedinFounder} target="_blank" rel="noopener">{CONTACT.founder}</a></dd></div>
              <div><dt>LOCATION</dt><dd>{CONTACT.location}</dd></div>
            </dl>
          </div>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
