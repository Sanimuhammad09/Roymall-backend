"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var generateProducts = function (family, count, startIdx) {
    var images = [
        'https://lh3.googleusercontent.com/aida/AP1WRLs7lhs59CWcBZRC3eBkA6gDOWd0Sd-R5pXnfXphe-jcRu95HoEwfwZycrZzvhAobVINgEgMS6A_X7LzmV7E3qIlQ-NSIpySuyPfnG_pNuH9RORySsIm8CDjT2VNxkdx-Qk_UR94Baa7RDWgISm30-0uO_XzVNojTrV5ZtQsODbZVtA3B1eiFv7NN09wpUUcSLxvHZlef1Od559dMaiEu1Aqzf6kyvgDrXdLejq5mUoaF2lzksLkjeniKec',
        'https://lh3.googleusercontent.com/aida/AP1WRLvMpEBrp3hNfTZiz8E9kRjEcWhqR56gMcL7g2H6XdXnVj8xvYTkzOsimlEaE3ZxvBNoWBWSIklAC89B8SNW6rI86O_n6WI0u6nmVPIhIbzMGRCBhoAK6i7_U2O6F4s3qmYCNPKJcKfuhu5HTscjzBFSQTGcRpq36cCeoHLdjhsVUTS-1-ijigcnnsBzmv0H-9aYOBPcr5HrjAxWmUtOJA5bRKuRNC6_mgpjrC8yuIWAG317k5vh_I9jIwU',
        'https://lh3.googleusercontent.com/aida/AP1WRLtzInhxhAxvqi2L1o9iPujmqTHSyVdTSaFl8bJuIzpnMhZPp1TzekBX1eQ9YcoA2Se94VtxoKikY0qH5NNe-FR_Lz6GTalDSCvlEninjfcc4ZZhY4RefewE87sSbwQdxbLtaiAa_rUFvAMvddcvYukbyhs1HqUDzYdsXas9kYX24T63j6HCkaVhuRHEIKwZhxVSt0pGescBIjvGBc3WhUbDKEj2OVjhd7zq52nowOeps7o3Ush8aS4YO7Q',
        'https://lh3.googleusercontent.com/aida/AP1WRLvGWbfIGT7K3MB0ramNcnSKc-PEyoEMK_p0owDEj5DZBiOo8P8nPTbmRCZtZGayFah2krEvBsqO9QBFMH7lvGevUTXNo1jGCNlLoh9gLe-5aXPoZsZw4ghJV25jByy7SxN4Au3cJ23fAp9dUbB6LYssFMhV2f1kLZ67dw4-oJ-_9VW4GWp0uZbjKpMVQmjp05EnHLJPC6DxfgAfnsyjTSgZBXsR2yFjWm58DayxvtmQ7pddVC_ii_H2TP8',
        'https://lh3.googleusercontent.com/aida/AP1WRLsctGzKgIBkKa5Y0a7IaoZhHtRD1NBkcKvtbmm2n-ar3ZT1lM7JmGCSf38hoOGUi76vTY3i5tQY_-Zaq2__0xGVcxoaELvwzwCtqB-c4J6u4QWODMmOTT0T5QrkKsikPpIKLToZzu1dKkPnm-N-7hERhTKvIR4OXZTvLCZqFZv8xwDAyoyQ4InMLo_bUsTRIORmAdQeG-mOBr1Eb5X_AmS1QGPLHtDEp2RpUnKW6oYuq1qPJpYT2jDCtQ',
        'https://lh3.googleusercontent.com/aida/AP1WRLsp39ljzdd-ZvLvNUhmnWs3V1QaLLHSwvIhLQITr7uYUFbja-MO5AZRLAHqBeJK1P9CN5UaZ6iEmHo4LlnHM0bbRSiRM8ogekLlD5wA4CmiQFkQS6roUTnO5iTIbwdnDE2OeI_f4Po2B2w8ZXXviBq7zDi2by22zKckuUlrFGU1rcwS42tV_5YZleeEZeTWdeTedqD6ArdO5Pk6wLYxCbenuhRi3ks5XeQPMWnILoeQ17jeKb6msSs-IRQ'
    ];
    var products = [];
    for (var i = 0; i < count; i++) {
        var idNum = startIdx + i;
        products.push({
            name: "".concat(family, " Masterpiece ").concat(idNum),
            tagline: "A signature ".concat(family.toLowerCase(), " scent"),
            description: "Experience the finest ".concat(family.toLowerCase(), " notes meticulously blended for long-lasting sillage."),
            price: Math.floor(Math.random() * (250000 - 50000 + 1) + 50000), // Random price 50k to 250k
            sku: "ROY-".concat(family.toUpperCase().substring(0, 3), "-").concat(idNum),
            stockQuantity: Math.floor(Math.random() * 100) + 10,
            size: i % 2 === 0 ? "100ml" : "50ml",
            olfactoryFamily: family,
            isBestSeller: i < 3,
            isNewArrival: i > 7,
            topNotes: ["".concat(family, " Top 1"), "".concat(family, " Top 2")],
            heartNotes: ["".concat(family, " Heart 1")],
            baseNotes: ["".concat(family, " Base 1")],
            imageUrl: images[i % images.length],
        });
    }
    return products;
};
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var category, allProductsData, createdCount, _i, allProductsData_1, p, existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.category.findFirst()];
                case 1:
                    category = _a.sent();
                    if (!!category) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.category.create({
                            data: { name: 'Unisex Collection', slug: 'unisex-collection', description: 'Universal scents for all.' }
                        })];
                case 2:
                    category = _a.sent();
                    _a.label = 3;
                case 3:
                    allProductsData = __spreadArray(__spreadArray(__spreadArray([], generateProducts('Floral', 10, 100), true), generateProducts('Citrus', 10, 200), true), generateProducts('Woody', 10, 300), true);
                    createdCount = 0;
                    _i = 0, allProductsData_1 = allProductsData;
                    _a.label = 4;
                case 4:
                    if (!(_i < allProductsData_1.length)) return [3 /*break*/, 8];
                    p = allProductsData_1[_i];
                    return [4 /*yield*/, prisma.product.findUnique({ where: { sku: p.sku } })];
                case 5:
                    existing = _a.sent();
                    if (!!existing) return [3 /*break*/, 7];
                    return [4 /*yield*/, prisma.product.create({
                            data: {
                                name: p.name,
                                tagline: p.tagline,
                                description: p.description,
                                price: p.price,
                                sku: p.sku,
                                stockQuantity: p.stockQuantity,
                                size: p.size,
                                olfactoryFamily: p.olfactoryFamily,
                                isBestSeller: p.isBestSeller,
                                isNewArrival: p.isNewArrival,
                                topNotes: p.topNotes,
                                heartNotes: p.heartNotes,
                                baseNotes: p.baseNotes,
                                categoryId: category.id,
                                images: {
                                    create: [
                                        {
                                            url: p.imageUrl,
                                            isPrimary: true,
                                            order: 1
                                        }
                                    ]
                                }
                            }
                        })];
                case 6:
                    _a.sent();
                    createdCount++;
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 4];
                case 8:
                    console.log("Successfully seeded ".concat(createdCount, " products!"));
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
