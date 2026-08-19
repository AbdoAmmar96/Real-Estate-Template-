<?php

namespace App\Support;

/**
 * بيانات تجريبية للعرض فقط — أسماء المشاريع خيالية والأرقام واقعية للسوق.
 * الصور من Unsplash ومحمّلة محليًا في public/images/demo.
 * في المرحلة 4 الصفحات بتتوصل بموديلات Properties/Compounds بنفس شكل الـ props.
 */
class DemoContent
{
    public static function properties(string $locale): array
    {
        $ar = $locale === 'ar';

        return [
            [
                'id' => 1,
                'title' => $ar ? 'شقة 165م بجاردن خاصة في التجمع الخامس' : 'Apartment 165m with private garden in Fifth Settlement',
                'area' => $ar ? 'القاهرة الجديدة' : 'New Cairo',
                'purpose' => $ar ? 'بيع' : 'Sale',
                'price' => 'EGP 4,850,000',
                'beds' => 3, 'baths' => 2, 'size' => 165,
                'ref' => 'XH-1001',
                'image' => '/images/demo/property-1.jpg',
            ],
            [
                'id' => 2,
                'title' => $ar ? 'فيلا مستقلة 420م تشطيب كامل' : 'Standalone villa 420m fully finished',
                'area' => $ar ? 'العاصمة الإدارية' : 'New Capital',
                'purpose' => $ar ? 'بيع' : 'Sale',
                'price' => 'EGP 18,500,000',
                'beds' => 5, 'baths' => 5, 'size' => 420,
                'ref' => 'XH-1002',
                'image' => '/images/demo/property-2.jpg',
            ],
            [
                'id' => 3,
                'title' => $ar ? 'شقة بحرية 140م على الكورنيش' : 'Sea-view apartment 140m on the Corniche',
                'area' => $ar ? 'الإسكندرية' : 'Alexandria',
                'purpose' => $ar ? 'بيع' : 'Sale',
                'price' => 'EGP 6,200,000',
                'beds' => 3, 'baths' => 2, 'size' => 140,
                'ref' => 'XH-1003',
                'image' => '/images/demo/property-3.jpg',
            ],
            [
                'id' => 4,
                'title' => $ar ? 'شقة مفروشة للإيجار بالمطبخ والتكييفات' : 'Furnished apartment for rent with kitchen and ACs',
                'area' => $ar ? 'القاهرة الجديدة' : 'New Cairo',
                'purpose' => $ar ? 'إيجار' : 'Rent',
                'price' => $ar ? 'EGP 38,000 / شهريًا' : 'EGP 38,000 / mo',
                'beds' => 2, 'baths' => 2, 'size' => 156,
                'ref' => 'XH-1004',
                'image' => '/images/demo/property-4.jpg',
            ],
            [
                'id' => 5,
                'title' => $ar ? 'توين هاوس 280م استلام فوري' : 'Twin house 280m ready to move',
                'area' => $ar ? 'العاصمة الإدارية' : 'New Capital',
                'purpose' => $ar ? 'بيع' : 'Sale',
                'price' => 'EGP 9,750,000',
                'beds' => 4, 'baths' => 3, 'size' => 280,
                'ref' => 'XH-1005',
                'image' => '/images/demo/property-5.jpg',
            ],
            [
                'id' => 6,
                'title' => $ar ? 'مكتب إداري 65م في برج مرخّص' : 'Office 65m in a licensed tower',
                'area' => $ar ? 'العاصمة الإدارية' : 'New Capital',
                'purpose' => $ar ? 'بيع' : 'Sale',
                'price' => 'EGP 3,900,000',
                'beds' => 0, 'baths' => 1, 'size' => 65,
                'ref' => 'XH-1006',
                'image' => '/images/demo/property-6.jpg',
            ],
            [
                'id' => 7,
                'title' => $ar ? 'دوبلكس 235م بروف خاص' : 'Duplex 235m with private roof',
                'area' => $ar ? 'القاهرة الجديدة' : 'New Cairo',
                'purpose' => $ar ? 'بيع' : 'Sale',
                'price' => 'EGP 7,400,000',
                'beds' => 4, 'baths' => 3, 'size' => 235,
                'ref' => 'XH-1007',
                'image' => '/images/demo/property-7.jpg',
            ],
            [
                'id' => 8,
                'title' => $ar ? 'استوديو 78م مفروش بالكامل للإيجار' : 'Fully furnished studio 78m for rent',
                'area' => $ar ? 'الإسكندرية' : 'Alexandria',
                'purpose' => $ar ? 'إيجار' : 'Rent',
                'price' => $ar ? 'EGP 19,500 / شهريًا' : 'EGP 19,500 / mo',
                'beds' => 1, 'baths' => 1, 'size' => 78,
                'ref' => 'XH-1008',
                'image' => '/images/demo/property-8.jpg',
            ],
            [
                'id' => 9,
                'title' => $ar ? 'شقة 190م بفيو لاندسكيب مفتوح' : 'Apartment 190m with open landscape view',
                'area' => $ar ? 'القاهرة الجديدة' : 'New Cairo',
                'purpose' => $ar ? 'بيع' : 'Sale',
                'price' => 'EGP 5,600,000',
                'beds' => 3, 'baths' => 3, 'size' => 190,
                'ref' => 'XH-1009',
                'image' => '/images/demo/property-9.jpg',
            ],
        ];
    }

    public static function compounds(string $locale): array
    {
        $ar = $locale === 'ar';

        return [
            [
                'id' => 1,
                'name' => $ar ? 'النخيل هايتس' : 'Nakheel Heights',
                'developer' => $ar ? 'شركة المروج للتطوير' : 'Al Morouj Developments',
                'area' => $ar ? 'القاهرة الجديدة' : 'New Cairo',
                'starting' => 'EGP 5,400,000',
                'down' => '5%',
                'years' => $ar ? '8 سنوات' : '8 years',
                'new' => true,
                'image' => '/images/demo/compound-1.jpg',
            ],
            [
                'id' => 2,
                'name' => $ar ? 'لاجون باي' : 'Lagoon Bay',
                'developer' => $ar ? 'الوادي القابضة' : 'Al Wadi Holding',
                'area' => $ar ? 'الإسكندرية' : 'Alexandria',
                'starting' => 'EGP 6,000,000',
                'down' => '10%',
                'years' => $ar ? '10 سنوات' : '10 years',
                'new' => true,
                'image' => '/images/demo/compound-2.jpg',
            ],
            [
                'id' => 3,
                'name' => $ar ? 'كابيتال سكوير' : 'Capital Square',
                'developer' => $ar ? 'بناة المستقبل' : 'Future Builders',
                'area' => $ar ? 'العاصمة الإدارية' : 'New Capital',
                'starting' => 'EGP 7,200,000',
                'down' => '5%',
                'years' => $ar ? '7 سنوات' : '7 years',
                'new' => true,
                'image' => '/images/demo/compound-3.jpg',
            ],
            [
                'id' => 4,
                'name' => $ar ? 'سيلين ريزيدنس' : 'Selene Residence',
                'developer' => $ar ? 'شركة المروج للتطوير' : 'Al Morouj Developments',
                'area' => $ar ? 'العاصمة الإدارية' : 'New Capital',
                'starting' => 'EGP 4,300,000',
                'down' => '10%',
                'years' => $ar ? '6 سنوات' : '6 years',
                'new' => false,
                'image' => '/images/demo/property-5.jpg',
            ],
            [
                'id' => 5,
                'name' => $ar ? 'مارينا ووك' : 'Marina Walk',
                'developer' => $ar ? 'الوادي القابضة' : 'Al Wadi Holding',
                'area' => $ar ? 'الإسكندرية' : 'Alexandria',
                'starting' => 'EGP 3,850,000',
                'down' => '15%',
                'years' => $ar ? '5 سنوات' : '5 years',
                'new' => false,
                'image' => '/images/demo/property-3.jpg',
            ],
            [
                'id' => 6,
                'name' => $ar ? 'جرين أفينيو' : 'Green Avenue',
                'developer' => $ar ? 'بناة المستقبل' : 'Future Builders',
                'area' => $ar ? 'القاهرة الجديدة' : 'New Cairo',
                'starting' => 'EGP 8,900,000',
                'down' => '5%',
                'years' => $ar ? '9 سنوات' : '9 years',
                'new' => false,
                'image' => '/images/demo/property-2.jpg',
            ],
        ];
    }

    /** بطاقات قسم "مناطق بنغطيها بالتفصيل" في الرئيسية */
    public static function areas(string $locale): array
    {
        $ar = $locale === 'ar';

        return [
            [
                'id' => 1,
                'name' => $ar ? 'القاهرة الجديدة' : 'New Cairo',
                'note' => $ar ? 'التجمع الخامس · الرحاب · مدينتي' : 'Fifth Settlement · Rehab · Madinaty',
                'count' => $ar ? '412 وحدة' : '412 units',
                'image' => '/images/demo/area-1.jpg',
            ],
            [
                'id' => 2,
                'name' => $ar ? 'العاصمة الإدارية' : 'New Capital',
                'note' => $ar ? 'الحي السكني R7 · R8 · الداون تاون' : 'R7 · R8 · Downtown',
                'count' => $ar ? '389 وحدة' : '389 units',
                'image' => '/images/demo/area-2.jpg',
            ],
            [
                'id' => 3,
                'name' => $ar ? 'الإسكندرية' : 'Alexandria',
                'note' => $ar ? 'سموحة · سان ستيفانو · العجمي' : 'Smouha · San Stefano · Agami',
                'count' => $ar ? '246 وحدة' : '246 units',
                'image' => '/images/demo/area-3.jpg',
            ],
        ];
    }

    /** خيارات البحث في الهيرو — الأنواع والمناطق بأعدادها */
    public static function searchOptions(string $locale): array
    {
        $ar = $locale === 'ar';

        return [
            'types' => $ar
                ? ['شقق', 'فلل', 'تاون هاوس', 'توين هاوس', 'دوبلكس', 'بنتهاوس', 'تجاري', 'عيادات', 'محلات', 'مكاتب']
                : ['Apartments', 'Villas', 'Townhouses', 'Twin houses', 'Duplexes', 'Penthouses', 'Commercial', 'Clinics', 'Shops', 'Offices'],

            'locations' => $ar
                ? ['القاهرة الجديدة', 'الشيخ زايد', 'الساحل الشمالي', 'العين السخنة', 'العاصمة الإدارية الجديدة', 'السادس من أكتوبر', 'الغردقة']
                : ['New Cairo', 'Sheikh Zayed', 'North Coast', 'Ain Sokhna', 'New Administrative Capital', '6th of October', 'Hurghada'],

            'stats' => [
                ['value' => '6000', 'suffix' => '+', 'label' => $ar ? 'عقار' : 'properties'],
                ['value' => '420',  'suffix' => '+', 'label' => $ar ? 'كمبوند' : 'compounds'],
                ['value' => '161',  'suffix' => '+', 'label' => $ar ? 'مطوّر' : 'developers'],
            ],
        ];
    }
}
