import avro from 'avsc';

export default avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name: 'item1',
      type: 'string',
    },
    {
      name: 'item2',
      type: 'string',
    }
  ]
});
