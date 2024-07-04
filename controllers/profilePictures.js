const uploadProfilePicture = async (req, res) => {
    try {
      const filePath = req.file.path; // Caminho da imagem salva pelo Multer
      // Aqui você pode salvar o caminho da imagem no banco de dados do usuário
      // Exemplo: atualização do campo 'profile_picture' no registro do usuário
      res.status(200).json({ message: 'Upload bem-sucedido', filePath });
    } catch (error) {
      console.error('Erro no upload:', error);
      res.status(500).json({ message: 'Erro no upload', error });
    }
  };
  
  module.exports = {
    uploadProfilePicture,
  };
  