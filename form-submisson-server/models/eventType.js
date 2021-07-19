import avro from 'avsc';

export default avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name: 'category',
      type: 'string',
    },
    {
      name: 'noise',
      type: 'string',
    }
  ]
});
