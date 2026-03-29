module.exports = {
    ConvertTitleToSlug: function (title) {
        // Transliterate Vietnamese characters to ASCII
        const vietnameseMap = {
            'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
            'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
            'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
            'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
            'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
            'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
            'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
            'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
            'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
            'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
            'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
            'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
            'đ': 'd',
            'Á': 'a', 'À': 'a', 'Ả': 'a', 'Ã': 'a', 'Ạ': 'a',
            'Ă': 'a', 'Ắ': 'a', 'Ằ': 'a', 'Ẳ': 'a', 'Ẵ': 'a', 'Ặ': 'a',
            'Â': 'a', 'Ấ': 'a', 'Ầ': 'a', 'Ẩ': 'a', 'Ẫ': 'a', 'Ậ': 'a',
            'É': 'e', 'È': 'e', 'Ẻ': 'e', 'Ẽ': 'e', 'Ẹ': 'e',
            'Ê': 'e', 'Ế': 'e', 'Ề': 'e', 'Ể': 'e', 'Ễ': 'e', 'Ệ': 'e',
            'Í': 'i', 'Ì': 'i', 'Ỉ': 'i', 'Ĩ': 'i', 'Ị': 'i',
            'Ó': 'o', 'Ò': 'o', 'Ỏ': 'o', 'Õ': 'o', 'Ọ': 'o',
            'Ô': 'o', 'Ố': 'o', 'Ồ': 'o', 'Ổ': 'o', 'Ỗ': 'o', 'Ộ': 'o',
            'Ơ': 'o', 'Ớ': 'o', 'Ờ': 'o', 'Ở': 'o', 'Ỡ': 'o', 'Ợ': 'o',
            'Ú': 'u', 'Ù': 'u', 'Ủ': 'u', 'Ũ': 'u', 'Ụ': 'u',
            'Ư': 'u', 'Ứ': 'u', 'Ừ': 'u', 'Ử': 'u', 'Ữ': 'u', 'Ự': 'u',
            'Ý': 'y', 'Ỳ': 'y', 'Ỷ': 'y', 'Ỹ': 'y', 'Ỵ': 'y',
            'Đ': 'd'
        };

        let result = title.toLowerCase();
        
        // Replace Vietnamese characters with ASCII equivalents
        result = result.split('').map(char => vietnameseMap[char] || char).join('');
        
        // Remove special characters, keep only letters, numbers, spaces, and hyphens
        result = result.replace(/[^a-z0-9\s-]/g, '');
        
        // Replace spaces and underscores with hyphens
        result = result.replace(/[\s_]+/g, '-');
        
        // Remove leading/trailing hyphens
        result = result.replace(/^-+|-+$/g, '');
        
        // Remove consecutive hyphens
        result = result.replace(/-+/g, '-');
        
        return result;
    }
}
