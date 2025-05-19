export default {
  name: 'user',
  title: 'Bruker',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Navn',
      type: 'string'
    },
    {
      name: 'gender',
      title: 'Kjønn',
      type: 'string'
    },
    {
      name: 'birthdate',
      title: 'Fødselsdato',
      type: 'date'
    },
    {
      name: 'image',
      title: 'Profilbilde',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'wishlist',
      title: 'Ønskeliste',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'event' }] }]
    },
    {
      name: 'previousPurchases',
      title: 'Tidligere kjøp',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'event' }] }]
    },
    {
      name: 'friends',
      title: 'Venner',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'user' }] }]
    }
  ]
};
