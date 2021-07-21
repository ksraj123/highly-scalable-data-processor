import avro from 'avsc';

export const fields = [
  {
    name: 'name',
    type: 'string',
  },
  {
    name: 'email',
    type: 'string',
  },
  {
    name: 'university',
    type: 'string',
  },
  {
    name: 'cgpa',
    type: 'string',
  },
  {
    name: 'tech',
    type: 'string',
  },
  {
    name: 'gender',
    type: {
      type: 'enum',
      symbols: ['M', 'F']
    },
  },
  {
    name: 'age',
    type: 'string',
  },
  {
    name: 'mobile',
    type: 'string',
  }
];

export default avro.Type.forSchema({
  type: 'record',
  fields
});
