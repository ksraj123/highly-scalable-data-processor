import avro from 'avsc';

export default avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'roll',
      type: 'string',
    },
    {
      name: 'university',
      type: 'string',
    },
  ]
});
