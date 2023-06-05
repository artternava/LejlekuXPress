﻿using LejlekuXpress.Data;
using LejlekuXpress.Data.DTO;
using LejlekuXpress.Models;
using Microsoft.EntityFrameworkCore;

namespace LejlekuXpress.Services
{
    public class WishlistService
    {
        private readonly AppDbContext _context;

        public WishlistService(AppDbContext context)
        {
            _context = context;
        }

        #region AddItem
        public async Task<Wishlist> AddItem(WishlistDTO request)
        {
            try
            {
                Wishlist wishlist = new Wishlist
                {
                    UserId = request.UserId,
                    ProductId = request.ProductId,
                };

                _context.Wishlist.Add(wishlist);
                await _context.SaveChangesAsync();

                return wishlist;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to save the wishlist record.");
            }
        }
        #endregion

    }
}
