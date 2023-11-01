const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

describe('API Test Suite', () => {
    let authToken;
    let listBookData;
    let listBook;
    let isbnCollection;

    it('Authenticate and Get Auth Token', async () => {
        const authData = {
            userName: process.env.USERNAME,
            password: process.env.PASSWORD,
        };

        // Lakukan permintaan otentikasi untuk mendapatkan token
        const response = await axios.post('https://bookstore.toolsqa.com/Account/v1/GenerateToken', authData);

        expect(response.status).toEqual(200);
        authToken = response.data.token;
    });

    it('Get List of Books', async () => {

        // Tambahkan token otentikasi ke header permintaan
        const headers = {
            'Authorization': `Bearer ${authToken}`,
        };

        // Lakukan permintaan POST untuk membuat buku baru
        const response = await axios.get('https://bookstore.toolsqa.com/BookStore/v1/Books');

        expect(response.status).toEqual(200);

        // Konversi menjadi objek JSON untuk request berikutnya
        listBookData = {
            "userId": process.env.USERID,
            "collectionOfIsbns": response.data.books.map((book) => {
                return { "isbn": book.isbn };
            })
        };

        listBook = response.data.books.map((book) => book.isbn);

    });

    it('Add book to collection', async () => {

        // Tambahkan token otentikasi ke header permintaan
        const headers = {
            'Authorization': `Bearer ${authToken}`,
        };

        // Lakukan permintaan POST untuk membuat buku baru
        const response = await axios.post('https://bookstore.toolsqa.com/BookStore/v1/Books', listBookData, { headers });

        expect(response.status).toEqual(201);

        isbnCollection = response.data.books.map((book) => book.isbn);
        
        // Lakukan validasi untuk melihat bahwa seluruh data buku yang ditambahkan ke dalam collection berhasil tersimpan
        expect(isbnCollection).toEqual(listBook)

    });

    it('Delete the Created Book', async () => {
        // Tambahkan token otentikasi ke header permintaan
        const headers = {
            'Authorization': `Bearer ${authToken}`,
        };

        // Lakukan permintaan DELETE untuk menghapus buku yang telah ditambahkan ke collection user sebelumnya
        const response = await axios.delete('https://bookstore.toolsqa.com/BookStore/v1/Books?UserId=' + process.env.USERID, { headers });

        expect(response.status).toEqual(204);
    });
});
