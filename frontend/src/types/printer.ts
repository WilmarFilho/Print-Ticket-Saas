export default interface PrinterData {
  id: string;
  modelo: string;
  serial: string;
  contador: number;
  status: 'online' | 'offline' | 'warning';
}