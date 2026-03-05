import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Section from './Section';

describe('Section Component', () => {
  describe('when section is null or undefined', () => {
    it('should return null when section is null', () => {
      const { container } = render(<Section section={null} />);
      expect(container.firstChild).toBeNull();
    });

    it('should return null when section is undefined', () => {
      const { container } = render(<Section section={undefined} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('contact section rendering', () => {
    it('should render contact section with ContactForm when id is "contact"', () => {
      const section = {
        id: 'contact',
        icon: 'FaAddressCard',
        title: 'Contact Me',
        content: {
          email: 'test@example.com',
          linkedin: 'https://linkedin.com/in/test',
        },
      };

      render(<Section section={section} />);

      const sectionElement = screen.getByRole('region');
      expect(sectionElement).toHaveAttribute('id', 'contact');
      expect(screen.getByText('Contact Me')).toBeInTheDocument();
    });

    it('should render contact form in contact section', () => {
      const section = {
        id: 'contact',
        icon: 'FaAddressCard',
        title: 'Contact',
        content: { email: 'test@example.com' },
      };

      render(<Section section={section} />);
      // ContactForm should be rendered (checking for scroll-mt-20 class which wraps it)
      const sectionElement = screen.getByRole('region');
      expect(sectionElement).toHaveClass('scroll-mt-20');
    });

    it('should display contact content with email and linkedin in contact section', () => {
      const section = {
        id: 'contact',
        icon: 'FaAddressCard',
        title: 'Contact',
        content: {
          email: 'contact@test.com',
          linkedin: 'https://linkedin.com/in/contact',
        },
      };

      render(<Section section={section} />);

      expect(screen.getByText(/Email:/)).toBeInTheDocument();
      expect(screen.getByText('contact@test.com')).toBeInTheDocument();
      expect(screen.getByText(/LinkedIn:/)).toBeInTheDocument();
      expect(screen.getByText('https://linkedin.com/in/contact')).toBeInTheDocument();
    });

    it('should display only email when linkedin is not provided in contact section', () => {
      const section = {
        id: 'contact',
        icon: 'FaAddressCard',
        title: 'Contact',
        content: {
          email: 'contact@test.com',
        },
      };

      render(<Section section={section} />);

      expect(screen.getByText(/Email:/)).toBeInTheDocument();
      expect(screen.getByText('contact@test.com')).toBeInTheDocument();
      expect(screen.queryByText(/LinkedIn:/)).not.toBeInTheDocument();
    });

    it('should display only linkedin when email is not provided in contact section', () => {
      const section = {
        id: 'contact',
        icon: 'FaAddressCard',
        title: 'Contact',
        content: {
          linkedin: 'https://linkedin.com/in/test',
        },
      };

      render(<Section section={section} />);

      expect(screen.getByText(/LinkedIn:/)).toBeInTheDocument();
      expect(screen.getByText('https://linkedin.com/in/test')).toBeInTheDocument();
      expect(screen.queryByText(/Email:/)).not.toBeInTheDocument();
    });
  });

  describe('non-contact section rendering', () => {
    it('should render non-contact section with title', () => {
      const section = {
        id: 'about',
        icon: 'FaBuilding',
        title: 'About Me',
        content: 'This is about me',
      };

      render(<Section section={section} />);

      const sectionElement = screen.getByRole('region');
      expect(sectionElement).toHaveAttribute('id', 'about');
      expect(screen.getByText('About Me')).toBeInTheDocument();
    });

    it('should render subtitle when provided', () => {
      const section = {
        id: 'experience',
        icon: 'FaHistory',
        title: 'Experience',
        subtitle: 'My Professional Journey',
        content: 'Some experience content',
      };

      render(<Section section={section} />);

      expect(screen.getByText('My Professional Journey')).toBeInTheDocument();
    });

    it('should not render subtitle when not provided', () => {
      const section = {
        id: 'experience',
        icon: 'FaHistory',
        title: 'Experience',
        content: 'Some experience content',
      };

      render(<Section section={section} />);

      expect(screen.queryByText(/My Professional/)).not.toBeInTheDocument();
    });

    it('should render string content as paragraph', () => {
      const section = {
        id: 'about',
        icon: 'FaBuilding',
        title: 'About',
        content: 'This is a test paragraph',
      };

      render(<Section section={section} />);

      expect(screen.getByText('This is a test paragraph')).toBeInTheDocument();
    });

    it('should not render null string content', () => {
      const section = {
        id: 'about',
        icon: 'FaBuilding',
        title: 'About',
        content: null,
      };

      render(<Section section={section} />);

      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('should not render empty string content', () => {
      const section = {
        id: 'about',
        icon: 'FaBuilding',
        title: 'About',
        content: '',
      };

      render(<Section section={section} />);

      expect(screen.getByText('About')).toBeInTheDocument();
    });
  });

  describe('icon rendering', () => {
    it('should render FaFilter icon when specified', () => {
      const section = {
        id: 'test',
        icon: 'FaFilter',
        title: 'Test Section',
        content: 'Content',
      };

      render(<Section section={section} />);

      const h2 = screen.getByText('Test Section').parentElement;
      expect(h2).toHaveClass('flex', 'items-center', 'gap-2');
    });

    it('should render FaGavel icon when specified', () => {
      const section = {
        id: 'test',
        icon: 'FaGavel',
        title: 'Test Section',
        content: 'Content',
      };

      render(<Section section={section} />);

      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    it('should render FaBuilding icon when specified', () => {
      const section = {
        id: 'test',
        icon: 'FaBuilding',
        title: 'Test Section',
        content: 'Content',
      };

      render(<Section section={section} />);

      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    it('should render FaHistory icon when specified', () => {
      const section = {
        id: 'test',
        icon: 'FaHistory',
        title: 'Test Section',
        content: 'Content',
      };

      render(<Section section={section} />);

      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    it('should render FaSchool icon when specified', () => {
      const section = {
        id: 'test',
        icon: 'FaSchool',
        title: 'Test Section',
        content: 'Content',
      };

      render(<Section section={section} />);

      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    it('should render FaBullseye icon when specified', () => {
      const section = {
        id: 'test',
        icon: 'FaBullseye',
        title: 'Test Section',
        content: 'Content',
      };

      render(<Section section={section} />);

      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    it('should render FaUniversalAccess icon when specified', () => {
      const section = {
        id: 'test',
        icon: 'FaUniversalAccess',
        title: 'Test Section',
        content: 'Content',
      };

      render(<Section section={section} />);

      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    it('should render FaAddressCard icon when specified', () => {
      const section = {
        id: 'contact',
        icon: 'FaAddressCard',
        title: 'Contact',
        content: { email: 'test@test.com' },
      };

      render(<Section section={section} />);

      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('should render null icon when icon name is not in iconMap', () => {
      const section = {
        id: 'test',
        icon: 'NonExistentIcon',
        title: 'Test Section',
        content: 'Content',
      };

      render(<Section section={section} />);

      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    it('should render null icon when icon is not provided', () => {
      const section = {
        id: 'test',
        title: 'Test Section',
        content: 'Content',
      };

      render(<Section section={section} />);

      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });
  });

  describe('RenderContent with array content', () => {
    it('should render position type content with title, role, location, and date', () => {
      const section = {
        id: 'experience',
        icon: 'FaHistory',
        title: 'Experience',
        content: [
          {
            type: 'position',
            title: 'Senior Developer',
            role: 'Full Stack',
            location: 'New York',
            date: '2020-2023',
            bullets: ['Experience 1', 'Experience 2'],
          },
        ],
      };

      render(<Section section={section} />);

      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.getByText(/Full Stack/)).toBeInTheDocument();
      expect(screen.getByText(/New York/)).toBeInTheDocument();
      expect(screen.getByText(/2020-2023/)).toBeInTheDocument();
    });

    it('should render position bullets', () => {
      const section = {
        id: 'experience',
        icon: 'FaHistory',
        title: 'Experience',
        content: [
          {
            type: 'position',
            title: 'Senior Developer',
            role: 'Full Stack',
            location: 'New York',
            date: '2020-2023',
            bullets: ['Developed feature A', 'Led team of 5'],
          },
        ],
      };

      render(<Section section={section} />);

      expect(screen.getByText('Developed feature A')).toBeInTheDocument();
      expect(screen.getByText('Led team of 5')).toBeInTheDocument();
    });

    it('should render multiple positions', () => {
      const section = {
        id: 'experience',
        icon: 'FaHistory',
        title: 'Experience',
        content: [
          {
            type: 'position',
            title: 'Senior Developer',
            role: 'Full Stack',
            location: 'New York',
            date: '2020-2023',
            bullets: ['Bullet 1'],
          },
          {
            type: 'position',
            title: 'Junior Developer',
            role: 'Frontend',
            location: 'Boston',
            date: '2018-2020',
            bullets: ['Bullet 2'],
          },
        ],
      };

      render(<Section section={section} />);

      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.getByText('Junior Developer')).toBeInTheDocument();
    });

    it('should ignore array items with unknown type', () => {
      const section = {
        id: 'test',
        icon: 'FaBuilding',
        title: 'Test',
        content: [
          {
            type: 'unknown',
            data: 'some data',
          },
        ],
      };

      render(<Section section={section} />);

      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.queryByText('some data')).not.toBeInTheDocument();
    });

    it('should handle empty array content', () => {
      const section = {
        id: 'test',
        icon: 'FaBuilding',
        title: 'Test',
        content: [],
      };

      render(<Section section={section} />);

      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('section classes and attributes', () => {
    it('should apply scroll-mt-20 class to section', () => {
      const section = {
        id: 'test',
        icon: 'FaBuilding',
        title: 'Test',
        content: 'Content',
      };

      render(<Section section={section} />);

      const sectionElement = screen.getByRole('region');
      expect(sectionElement).toHaveClass('scroll-mt-20');
    });

    it('should apply correct id attribute to section', () => {
      const section = {
        id: 'my-section-id',
        icon: 'FaBuilding',
        title: 'Test',
        content: 'Content',
      };

      render(<Section section={section} />);

      const sectionElement = screen.getByRole('region');
      expect(sectionElement).toHaveAttribute('id', 'my-section-id');
    });

    it('should apply flex, items-center, and gap-2 classes to h2', () => {
      const section = {
        id: 'test',
        icon: 'FaBuilding',
        title: 'Test Title',
        content: 'Content',
      };

      render(<Section section={section} />);

      const h2 = screen.getByText('Test Title');
      expect(h2).toHaveClass('flex', 'items-center', 'gap-2');
    });

    it('should apply correct classes to subtitle h3', () => {
      const section = {
        id: 'test',
        icon: 'FaBuilding',
        title: 'Test',
        subtitle: 'My Subtitle',
        content: 'Content',
      };

      render(<Section section={section} />);

      const h3 = screen.getByText('My Subtitle');
      expect(h3).toHaveClass('text-lg', 'font-semibold');
    });

    it('should apply correct inline styles to subtitle h3', () => {
      const section = {
        id: 'test',
        icon: 'FaBuilding',
        title: 'Test',
        subtitle: 'My Subtitle',
        content: 'Content',
      };

      render(<Section section={section} />);

      const h3 = screen.getByText('My Subtitle');
      expect(h3).toHaveStyle({ opacity: '0.9' });
    });
  });

  describe('RenderContent with object content (non-contact)', () => {
    it('should render object content with email and linkedin', () => {
      const section = {
        id: 'test',
        icon: 'FaBuilding',
        title: 'Test',
        content: {
          email: 'test@example.com',
          linkedin: 'https://linkedin.com/in/test',
        },
      };

      render(<Section section={section} />);

      expect(screen.getByText(/Email:/)).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText(/LinkedIn:/)).toBeInTheDocument();
      expect(screen.getByText('https://linkedin.com/in/test')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle section with undefined content', () => {
      const section = {
        id: 'test',
        icon: 'FaBuilding',
        title: 'Test',
        content: undefined,
      };

      render(<Section section={section} />);

      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should handle section with null content', () => {
      const section = {
        id: 'test',
        icon: 'FaBuilding',
        title: 'Test',
        content: null,
      };

      render(<Section section={section} />);

      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should handle position with empty bullets array', () => {
      const section = {
        id: 'experience',
        icon: 'FaHistory',
        title: 'Experience',
        content: [
          {
            type: 'position',
            title: 'Developer',
            role: 'Full Stack',
            location: 'NYC',
            date: '2020-2023',
            bullets: [],
          },
        ],
      };

      render(<Section section={section} />);

      expect(screen.getByText('Developer')).toBeInTheDocument();
    });

    it('should handle object content with null email', () => {
      const section = {
        id: 'contact',
        icon: 'FaAddressCard',
        title: 'Contact',
        content: {
          email: null,
          linkedin: 'https://linkedin.com/in/test',
        },
      };

      render(<Section section={section} />);

      expect(screen.getByText(/LinkedIn:/)).toBeInTheDocument();
      expect(screen.queryByText(/Email:/)).not.toBeInTheDocument();
    });

    it('should handle contact section with empty object content', () => {
      const section = {
        id: 'contact',
        icon: 'FaAddressCard',
        title: 'Contact',
        content: {},
      };

      render(<Section section={section} />);

      expect(screen.getByText('Contact')).toBeInTheDocument();
    });
  });
});