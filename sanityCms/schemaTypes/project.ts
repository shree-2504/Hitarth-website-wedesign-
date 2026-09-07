import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Standalone Residential Tower"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used in the project URL, e.g. /work/coastal-towers',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location / tag',
      type: 'string',
      description: 'Short caption tag shown under the title, e.g. "Coastal Precinct"',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Residential', value: 'residential' },
          { title: 'Commercial', value: 'commercial' },
          { title: 'Industrial', value: 'industrial' },
          { title: 'Institutional', value: 'institutional' },
        ],
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description:
        'Further angles shown below the description on the project page. The main image is added automatically — no need to repeat it here.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Shown in the project detail view when a visitor clicks through from the gallery.',
    }),

    // Spec-sheet facts. All optional — the panel on the project page renders
    // only the ones that are filled in, and disappears if none are.
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'e.g. "2023", or a range like "2021–2023"',
      group: 'facts',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      description: 'Leave blank if the client would rather not be named.',
      group: 'facts',
    }),
    defineField({
      name: 'area',
      title: 'Area / scale',
      type: 'string',
      description: 'e.g. "2.4 acres" or "1.8 lakh sq ft"',
      group: 'facts',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Completed', value: 'Completed' },
          { title: 'Under construction', value: 'Under construction' },
          { title: 'Approved', value: 'Approved' },
          { title: 'In design', value: 'In design' },
        ],
      },
      group: 'facts',
    }),
    defineField({
      name: 'scope',
      title: 'Scope',
      type: 'string',
      description: 'What the studio handled, e.g. "Planning, design & CRZ approvals"',
      group: 'facts',
    }),

    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers show first in the gallery.',
    }),
  ],
  groups: [{ name: 'facts', title: 'Project facts' }],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'mainImage',
    },
  },
});
