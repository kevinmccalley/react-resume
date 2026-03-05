import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Section from '../src/Section.jsx';
import ContactForm from '../src/ContactForm';

vi.mock('../src/ContactForm', () => ({
  default: () => <div data-testid="contact-form">Contact Form</div>,
}));

vi.mock('react-markdown', () => ({
  default: ({ children }) => <div data-testid="markdown">{children}</div>,
}));

describe('Section Component', () => {
  describe('with null/undefined section', () => {
    it('should return null when section is null', () => {
      const { container } = render(<Section section={null} />);
      expect(container.firstChild).toBeNull();
    });

    it('should return null when section is undefined', () => {
      const { container } = render(<Section section={undefined} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('contact section', () => {
    it('should render contact section with ContactForm', () => {
      const section = {
        id: 'contact',
        title: 'Contact Me',
        icon: 'FaAddressCard',
        content: {
          email: 'test@example.com',
          linkedin: 'https://linkedin.com/in/test',
        },
      };

      render(<Section section={section} />);

      expect(screen.getByText('Contact Me')).toBeInTheDocument();
      expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    });

    it('should render contact content with email and linkedin', () => {
      const section = {
        id: 'contact',
        title: 'Get In Touch',
        icon: 'FaAddressCard',
        content: {
          email: 'contact@example.com',
          linkedin: 'linkedin.com/in/myprofile',
        },
      };

      render(<Section section={section} />);

      expect(screen.getByText(/contact@example.com/)).toBeInTheDocument();
      expect(screen.getByText(/linkedin.com\/in\/myprofile/)).toBeInTheDocument();
    });

    it('should render contact content with only email', () => {
      const section = {
        id: 'contact',
        title: 'Contact',
        icon: 'FaAddressCard',
        content: {
          email: 'only-email@test.com',
        },
      };

      render(<Section section={section} />);

      expect(screen.getByText(/only-email@test.com/)).toBeInTheDocument();
    });

    it('should render contact content with only linkedin', () => {
      const section = {
        id: 'contact',
        title: 'Contact',
        icon: 'FaAddressCard',
        content: {
          linkedin: 'linkedin-profile',
        },
      };

      render(<Section section={section} />);

      expect(screen.getByText(/linkedin-profile/)).toBeInTheDocument();
    });

    it('should have scroll-mt-20 class', () => {
      const section = {
        id: 'contact',
        title: 'Contact',
        icon: 'FaAddressCard',
        content: null,
      };

      const { container } = render(<Section section={section} />);
      const sectionElement = container.querySelector('section');

      expect(sectionElement).toHaveClass('scroll-mt-20');
    });
  });

  describe('non-contact sections', () => {
    it('should render basic section without subtitle', () => {
      const section = {
        id: 'about',
        title: 'About Me',
        icon: 'FaBullseye',
        content: 'This is about content',
      };

      render(<Section section={section} />);

      expect(screen.getByText('About Me')).toBeInTheDocument();
      expect(screen.getByText('This is about content')).toBeInTheDocument();
    });

    it('should render section with subtitle', () => {
      const section = {
        id: 'experience',
        title: 'Experience',
        subtitle: 'My Professional Journey',
        icon: 'FaHistory',
        content: 'Experience content',
      };

      render(<Section section={section} />);

      expect(screen.getByText('Experience')).toBeInTheDocument();
      expect(screen.getByText('My Professional Journey')).toBeInTheDocument();
      expect(screen.getByText('Experience content')).toBeInTheDocument();
    });

    it('should not render subtitle when not provided', () => {
      const section = {
        id: 'skills',
        title: 'Skills',
        icon: 'FaSchool',
        content: 'Skills content',
      };

      render(<Section section={section} />);

      expect(screen.queryByText(/My Professional/)).not.toBeInTheDocument();
    });

    it('should have scroll-mt-20 class on non-contact section', () => {
      const section = {
        id: 'about',
        title: 'About',
        content: 'Content',
      };

      const { container } = render(<Section section={section} />);
      const sectionElement = container.querySelector('section');

      expect(sectionElement).toHaveClass('scroll-mt-20');
    });
  });

  describe('RenderContent - string content', () => {
    it('should render string content in a paragraph', () => {
      const section = {
        id: 'about',
        title: 'About',
        content: 'Simple string content',
      };

      render(<Section section={section} />);

      expect(screen.getByText('Simple string content')).toBeInTheDocument();
    });

    it('should render empty string as null', () => {
      const section = {
        id: 'about',
        title: 'About',
        content: '',
      };

      const { container } = render(<Section section={section} />);

      expect(container.querySelector('p')).not.toBeInTheDocument();
    });
  });

  describe('RenderContent - array content with positions', () => {
    it('should render position type content correctly', () => {
      const section = {
        id: 'experience',
        title: 'Experience',
        content: [
          {
            type: 'position',
            title: 'Senior Developer',
            role: 'Lead Engineer',
            location: 'San Francisco',
            date: '2020-2023',
            bullets: ['Managed team', 'Led projects'],
          },
        ],
      };

      render(<Section section={section} />);

      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.getByText(/Lead Engineer/)).toBeInTheDocument();
      expect(screen.getByText(/San Francisco/)).toBeInTheDocument();
      expect(screen.getByText('2020-2023')).toBeInTheDocument();
    });

    it('should render position bullets with markdown', () => {
      const section = {
        id: 'experience',
        title: 'Experience',
        content: [
          {
            type: 'position',
            title: 'Developer',
            role: 'Software Engineer',
            location: 'NYC',
            date: '2021-2022',
            bullets: ['**Bold text**', '*Italic text*'],
          },
        ],
      };

      render(<Section section={section} />);

      expect(screen.getAllByTestId('markdown')).toHaveLength(2);
    });

    it('should render multiple positions', () => {
      const section = {
        id: 'experience',
        title: 'Experience',
        content: [
          {
            type: 'position',
            title: 'Position 1',
            role: 'Role 1',
            location: 'Location 1',
            date: '2020-2021',
            bullets: ['Bullet 1'],
          },
          {
            type: 'position',
            title: 'Position 2',
            role: 'Role 2',
            location: 'Location 2',
            date: '2021-2022',
            bullets: ['Bullet 2'],
          },
        ],
      };

      render(<Section section={section} />);

      expect(screen.getByText('Position 1')).toBeInTheDocument();
      expect(screen.getByText('Position 2')).toBeInTheDocument();
    });

    it('should handle position with empty bullets array', () => {
      const section = {
        id: 'experience',
        title: 'Experience',
        content: [
          {
            type: 'position',
            title: 'Job Title',
            role: 'Role',
            location: 'Location',
            date: '2020-2021',
            bullets: [],
          },
        ],
      };

      render(<Section section={section} />);

      expect(screen.getByText('Job Title')).toBeInTheDocument();
    });

    it('should not render items with unknown type', () => {
      const section = {
        id: 'experience',
        title: 'Experience',
        content: [
          {
            type: 'unknown',
            data: 'Some data',
          },
          {
            type: 'position',
            title: 'Valid Position',
            role: 'Role',
            location: 'Location',
            date: '2020',
            bullets: [],
          },
        ],
      };

      render(<Section section={section} />);

      expect(screen.getByText('Valid Position')).toBeInTheDocument();
      expect(screen.queryByText('Some data')).not.toBeInTheDocument();
    });
  });

  describe('RenderContent - object content (contact info)', () => {
    it('should render object with both email and linkedin', () => {
      const section = {
        id: 'test',
        title: 'Test',
        content: {
          email: 'test@example.com',
          linkedin: 'https://linkedin.com/in/test',
        },
      };

      render(<Section section={section} />);

      expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
      expect(screen.getByText(/https:\/\/linkedin.com\/in\/test/)).toBeInTheDocument();
    });

    it('should render object with only email', () => {
      const section = {
        id: 'test',
        title: 'Test',
        content: {
          email: 'email@test.com',
        },
      };

      render(<Section section={section} />);

      expect(screen.getByText(/email@test.com/)).toBeInTheDocument();
    });

    it('should render object with only linkedin', () => {
      const section = {
        id: 'test',
        title: 'Test',
        content: {
          linkedin: 'linkedin.com/profile',
        },
      };

      render(<Section section={section} />);

      expect(screen.getByText(/linkedin.com\/profile/)).toBeInTheDocument();
    });

    it('should handle object with no email or linkedin', () => {
      const section = {
        id: 'test',
        title: 'Test',
        content: {
          other: 'value',
        },
      };

      const { container } = render(<Section section={section} />);

      expect(container.querySelector('.contact-content')).toBeInTheDocument();
    });

    it('should not render email if it is falsy', () => {
      const section = {
        id: 'test',
        title: 'Test',
        content: {
          email: null,
          linkedin: 'linkedin.com',
        },
      };

      render(<Section section={section} />);

      expect(screen.queryByText(/Email:/)).not.toBeInTheDocument();
      expect(screen.getByText(/LinkedIn:/)).toBeInTheDocument();
    });
  });

  describe('Icon rendering', () => {
    it('should render icon from iconMap when available', () => {
      const section = {
        id: 'about',
        title: 'About',
        icon: 'FaBuilding',
        content: 'Content',
      };

      const { container } = render(<Section section={section} />);
      const h2 = container.querySelector('h2');

      expect(h2).toBeInTheDocument();
    });

    it('should render null when icon is not in iconMap', () => {
      const section = {
        id: 'about',
        title: 'About',
        icon: 'NonExistentIcon',
        content: 'Content',
      };

      render(<Section section={section} />);

      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('should render all available icons', () => {
      const icons = [
        'FaFilter',
        'FaGavel',
        'FaBuilding',
        'FaHistory',
        'FaSchool',
        'FaBullseye',
        'FaUniversalAccess',
        'FaAddressCard',
      ];

      icons.forEach((icon) => {
        const section = {
          id: 'test',
          title: 'Test',
          icon,
          content: 'Content',
        };

        const { container } = render(<Section section={section} />);
        expect(container.querySelector('h2')).toBeInTheDocument();
      });
    });

    it('should not render icon when icon prop is not provided', () => {
      const section = {
        id: 'about',
        title: 'About',
        content: 'Content',
      };

      render(<Section section={section} />);

      expect(screen.getByText('About')).toBeInTheDocument();
    });
  });

  describe('Section id attribute', () => {
    it('should set section id from props', () => {
      const section = {
        id: 'custom-id',
        title: 'Title',
        content: 'Content',
      };

      const { container } = render(<Section section={section} />);
      const sectionElement = container.querySelector('section');

      expect(sectionElement).toHaveAttribute('id', 'custom-id');
    });

    it('should set contact section id', () => {
      const section = {
        id: 'contact',
        title: 'Contact',
        content: null,
      };

      const { container } = render(<Section section={section} />);
      const sectionElement = container.querySelector('section');

      expect(sectionElement).toHaveAttribute('id', 'contact');
    });
  });

  describe('CSS classes', () => {
    it('should have correct styling classes on h3 subtitle', () => {
      const section = {
        id: 'test',
        title: 'Title',
        subtitle: 'Subtitle',
        content: 'Content',
      };

      const { container } = render(<Section section={section} />);
      const h3 = container.querySelector('h3');

      expect(h3).toHaveClass('text-lg');
      expect(h3).toHaveClass('font-semibold');
      expect(h3).toHaveClass('mt-1');
      expect(h3).toHaveClass('mb-3');
    });

    it('should have opacity style on subtitle', () => {
      const section = {
        id: 'test',
        title: 'Title',
        subtitle: 'Subtitle',
        content: 'Content',
      };

      const { container } = render(<Section section={section} />);
      const h3 = container.querySelector('h3');

      expect(h3).toHaveStyle({ opacity: '0.9' });
    });

    it('should have job-position class on position item', () => {
      const section = {
        id: 'experience',
        title: 'Experience',
        content: [
          {
            type: 'position',
            title: 'Job',
            role: 'Role',
            location: 'Location',
            date: '2020',
            bullets: [],
          },
        ],
      };

      const { container } = render(<Section section={section} />);
      const jobDiv = container.querySelector('.job-position');

      expect(jobDiv).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle null content', () => {
      const section = {
        id: 'about',
        title: 'About',
        content: null,
      };

      render(<Section section={section} />);

      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('should handle undefined content', () => {
      const section = {
        id: 'about',
        title: 'About',
        content: undefined,
      };

      render(<Section section={section} />);

      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('should handle array with null items', () => {
      const section = {
        id: 'test',
        title: 'Test',
        content: [null, undefined],
      };

      const { container } = render(<Section section={section} />);

      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should handle empty array content', () => {
      const section = {
        id: 'test',
        title: 'Test',
        content: [],
      };

      render(<Section section={section} />);

      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should handle special characters in title', () => {
      const section = {
        id: 'test',
        title: 'Title with <special> & characters',
        content: 'Content',
      };

      render(<Section section={section} />);

      expect(screen.getByText(/Title with/)).toBeInTheDocument();
    });
  });
});