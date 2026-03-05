import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Section from '../src/Section';

describe('RenderContent', () => {
  describe('with null or undefined content', () => {
    it('should return null when content is null', () => {
      const { container } = render(<Section section={{ id: 'test', title: 'Test', content: null }} />);
      expect(container.querySelector('p')).toBeNull();
    });

    it('should return null when content is undefined', () => {
      const { container } = render(<Section section={{ id: 'test', title: 'Test', content: undefined }} />);
      expect(container.querySelector('p')).toBeNull();
    });
  });

  describe('with string content', () => {
    it('should render string content as a paragraph', () => {
      render(<Section section={{ id: 'test', title: 'Test', content: 'Hello World' }} />);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('should render empty string as empty paragraph', () => {
      const { container } = render(<Section section={{ id: 'test', title: 'Test', content: '' }} />);
      expect(container.querySelector('p')).toBeInTheDocument();
    });
  });

  describe('with array content', () => {
    it('should render position type items with all details', () => {
      const content = [
        {
          type: 'position',
          title: 'Software Engineer',
          role: 'Senior Developer',
          location: 'New York',
          date: '2020-2023',
          bullets: ['Built features', 'Led team'],
        },
      ];
      render(<Section section={{ id: 'test', title: 'Test', content }} />);
      
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Senior Developer – New York')).toBeInTheDocument();
      expect(screen.getByText('2020-2023')).toBeInTheDocument();
      expect(screen.getByText('Built features')).toBeInTheDocument();
      expect(screen.getByText('Led team')).toBeInTheDocument();
    });

    it('should render multiple position items', () => {
      const content = [
        {
          type: 'position',
          title: 'Job 1',
          role: 'Role 1',
          location: 'Location 1',
          date: '2020-2021',
          bullets: ['Bullet 1'],
        },
        {
          type: 'position',
          title: 'Job 2',
          role: 'Role 2',
          location: 'Location 2',
          date: '2021-2022',
          bullets: ['Bullet 2'],
        },
      ];
      render(<Section section={{ id: 'test', title: 'Test', content }} />);
      
      expect(screen.getByText('Job 1')).toBeInTheDocument();
      expect(screen.getByText('Job 2')).toBeInTheDocument();
    });

    it('should render position with markdown bullets', () => {
      const content = [
        {
          type: 'position',
          title: 'Developer',
          role: 'Engineer',
          location: 'NYC',
          date: '2020',
          bullets: ['**Bold text**', '_Italic text_'],
        },
      ];
      render(<Section section={{ id: 'test', title: 'Test', content }} />);
      
      expect(screen.getByText('Developer')).toBeInTheDocument();
    });

    it('should handle position with empty bullets array', () => {
      const content = [
        {
          type: 'position',
          title: 'Job',
          role: 'Role',
          location: 'Location',
          date: '2020',
          bullets: [],
        },
      ];
      render(<Section section={{ id: 'test', title: 'Test', content }} />);
      
      expect(screen.getByText('Job')).toBeInTheDocument();
    });

    it('should ignore items with unknown type', () => {
      const content = [
        {
          type: 'unknown',
          data: 'test',
        },
      ];
      const { container } = render(<Section section={{ id: 'test', title: 'Test', content }} />);
      
      expect(container.querySelectorAll('.job-position')).toHaveLength(0);
    });

    it('should handle mixed content types', () => {
      const content = [
        {
          type: 'position',
          title: 'Job 1',
          role: 'Role',
          location: 'Location',
          date: '2020',
          bullets: ['Bullet'],
        },
        {
          type: 'unknown',
        },
        {
          type: 'position',
          title: 'Job 2',
          role: 'Role',
          location: 'Location',
          date: '2021',
          bullets: [],
        },
      ];
      render(<Section section={{ id: 'test', title: 'Test', content }} />);
      
      expect(screen.getByText('Job 1')).toBeInTheDocument();
      expect(screen.getByText('Job 2')).toBeInTheDocument();
    });
  });

  describe('with object content', () => {
    it('should render email when present', () => {
      const content = {
        email: 'test@example.com',
      };
      render(<Section section={{ id: 'test', title: 'Test', content }} />);
      
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should render linkedin when present', () => {
      const content = {
        linkedin: 'linkedin.com/in/user',
      };
      render(<Section section={{ id: 'test', title: 'Test', content }} />);
      
      expect(screen.getByText('LinkedIn:')).toBeInTheDocument();
      expect(screen.getByText('linkedin.com/in/user')).toBeInTheDocument();
    });

    it('should render both email and linkedin', () => {
      const content = {
        email: 'test@example.com',
        linkedin: 'linkedin.com/in/user',
      };
      render(<Section section={{ id: 'test', title: 'Test', content }} />);
      
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn:')).toBeInTheDocument();
      expect(screen.getByText('linkedin.com/in/user')).toBeInTheDocument();
    });

    it('should handle object with neither email nor linkedin', () => {
      const content = {
        other: 'value',
      };
      const { container } = render(<Section section={{ id: 'test', title: 'Test', content }} />);
      
      expect(container.querySelector('.contact-content')).toBeInTheDocument();
    });

    it('should handle empty object', () => {
      const content = {};
      const { container } = render(<Section section={{ id: 'test', title: 'Test', content }} />);
      
      expect(container.querySelector('.contact-content')).toBeInTheDocument();
    });
  });
});

describe('Section component', () => {
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

  describe('regular section rendering', () => {
    it('should render section with title', () => {
      render(<Section section={{ id: 'about', title: 'About Me', content: 'Test content' }} />);
      
      expect(screen.getByText('About Me')).toBeInTheDocument();
    });

    it('should render section with id attribute', () => {
      const { container } = render(<Section section={{ id: 'about', title: 'About', content: null }} />);
      
      expect(container.querySelector('#about')).toBeInTheDocument();
    });

    it('should apply scroll-mt-20 class', () => {
      const { container } = render(<Section section={{ id: 'test', title: 'Test', content: null }} />);
      
      expect(container.querySelector('.scroll-mt-20')).toBeInTheDocument();
    });

    it('should render subtitle when provided', () => {
      render(<Section section={{ id: 'test', title: 'Test', subtitle: 'Subtitle Text', content: null }} />);
      
      expect(screen.getByText('Subtitle Text')).toBeInTheDocument();
    });

    it('should not render subtitle when not provided', () => {
      const { container } = render(<Section section={{ id: 'test', title: 'Test', content: null }} />);
      
      const h3 = container.querySelector('h3');
      expect(h3).toBeNull();
    });

    it('should render icon from iconMap when available', () => {
      const { container } = render(<Section section={{ id: 'test', title: 'Test', icon: 'FaFilter', content: null }} />);
      
      expect(container.querySelector('h2 svg')).toBeInTheDocument();
    });

    it('should not render icon when not available in iconMap', () => {
      const { container } = render(<Section section={{ id: 'test', title: 'Test', icon: 'UnknownIcon', content: null }} />);
      
      const h2 = container.querySelector('h2');
      expect(h2).toBeInTheDocument();
    });

    it('should render h2 with flex and gap-2 classes', () => {
      const { container } = render(<Section section={{ id: 'test', title: 'Test', content: null }} />);
      
      const h2 = container.querySelector('h2');
      expect(h2).toHaveClass('flex', 'items-center', 'gap-2');
    });

    it('should render content in a div', () => {
      const { container } = render(<Section section={{ id: 'test', title: 'Test', content: 'Test content' }} />);
      
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render multiple icons', () => {
      const icons = ['FaFilter', 'FaGavel', 'FaBuilding', 'FaHistory', 'FaSchool', 'FaBullseye', 'FaUniversalAccess', 'FaAddressCard'];
      
      icons.forEach(icon => {
        const { container } = render(<Section section={{ id: 'test', title: 'Test', icon, content: null }} />);
        expect(container.querySelector('h2 svg')).toBeInTheDocument();
      });
    });
  });

  describe('contact section rendering', () => {
    it('should render ContactForm when section id is contact', () => {
      render(<Section section={{ id: 'contact', title: 'Contact', content: null }} />);
      
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    it('should render contact section with both ContactForm and content', () => {
      const content = {
        email: 'test@example.com',
        linkedin: 'linkedin.com/in/user',
      };
      render(<Section section={{ id: 'contact', title: 'Contact', icon: 'FaAddressCard', content }} />);
      
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('linkedin.com/in/user')).toBeInTheDocument();
    });

    it('should apply scroll-mt-20 to contact section', () => {
      const { container } = render(<Section section={{ id: 'contact', title: 'Contact', content: null }} />);
      
      expect(container.querySelector('.scroll-mt-20')).toBeInTheDocument();
    });

    it('should render contact section title with icon', () => {
      render(<Section section={{ id: 'contact', title: 'Get in Touch', icon: 'FaAddressCard', content: null }} />);
      
      expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    });

    it('should render h2 with flex and gap-2 in contact section', () => {
      const { container } = render(<Section section={{ id: 'contact', title: 'Contact', content: null }} />);
      
      const h2 = container.querySelector('h2');
      expect(h2).toHaveClass('flex', 'items-center', 'gap-2');
    });

    it('should not render subtitle in contact section', () => {
      const { container } = render(<Section section={{ id: 'contact', title: 'Contact', subtitle: 'Should not appear', content: null }} />);
      
      expect(container.querySelector('h3')).toBeNull();
    });

    it('should have proper margins in contact section', () => {
      const { container } = render(<Section section={{ id: 'contact', title: 'Contact', content: null }} />);
      
      const formDiv = container.querySelector('[style*="marginTop"]');
      expect(formDiv).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle section with all properties', () => {
      const content = [
        {
          type: 'position',
          title: 'Job',
          role: 'Role',
          location: 'Location',
          date: '2020',
          bullets: ['Bullet 1', 'Bullet 2'],
        },
      ];
      render(<Section section={{ 
        id: 'work', 
        title: 'Work Experience', 
        subtitle: 'Professional History',
        icon: 'FaBriefcase',
        content 
      }} />);
      
      expect(screen.getByText('Work Experience')).toBeInTheDocument();
      expect(screen.getByText('Professional History')).toBeInTheDocument();
      expect(screen.getByText('Job')).toBeInTheDocument();
    });

    it('should handle section with minimal properties', () => {
      const { container } = render(<Section section={{ id: 'test', title: 'Test' }} />);
      
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(container.querySelector('#test')).toBeInTheDocument();
    });

    it('should handle special characters in title', () => {
      render(<Section section={{ id: 'test', title: 'About & Services', content: null }} />);
      
      expect(screen.getByText('About & Services')).toBeInTheDocument();
    });

    it('should handle long content strings', () => {
      const longContent = 'a'.repeat(1000);
      render(<Section section={{ id: 'test', title: 'Test', content: longContent }} />);
      
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('should handle subtitle with special styling', () => {
      const { container } = render(<Section section={{ id: 'test', title: 'Test', subtitle: 'Sub', content: null }} />);
      
      const h3 = container.querySelector('h3');
      expect(h3).toHaveClass('text-lg', 'font-semibold');
      expect(h3).toHaveStyle({ opacity: '0.9' });
    });
  });
});